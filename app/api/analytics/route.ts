export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../utils/database';
import Feedback from '../../models/feedback.schema';
import Event from '../../models/event.schema';
import { requireAuth, requireRole } from '../../utils/auth';

interface CategoryRatings {
  [key: string]: number[];
  overall: number[];
  content: number[];
  speakers: number[];
  venue: number[];
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { user } = authResult;
    
    await connectToDatabase();
    
    // Get event ID from query params
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    
    // Validate event ID
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }
    
    // Check if event exists and user has access
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Verify user has access to this event
    if (user.role !== 'admin' && event.organizerId.toString() !== user.id) {
      return NextResponse.json(
        { error: 'You do not have access to this event' },
        { status: 403 }
      );
    }
    
    // Get all feedback for this event
    const feedbackResponses = await Feedback.find({ 
      eventId, 
      completed: true 
    }).select('responses');
    
    // If no feedback
    if (feedbackResponses.length === 0) {
      return NextResponse.json({
        eventId,
        totalResponses: 0,
        ratings: {
          overall: [],
          content: [],
          speakers: [],
          venue: [],
        },
        sentiments: {
          positive: 0,
          neutral: 0,
          negative: 0,
        },
        keyTopics: [],
        responseRate: 0,
      });
    }
    
    // Process ratings
    const ratings: CategoryRatings = {
      overall: [],
      content: [],
      speakers: [],
      venue: [],
    };
    
    // Count sentiments
    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;
    
    // Key topics mentioned (from sentiment analysis)
    const topicsMap = new Map();
    
    // Process each feedback
    feedbackResponses.forEach(feedback => {
      const { responses } = feedback;
      
      // Process ratings
      ['overall', 'content', 'speakers', 'venue'].forEach(key => {
        if (responses[key]) {
          const rating = parseInt(responses[key]);
          if (!isNaN(rating)) {
            ratings[key].push(rating);
          }
        }
      });
      
      // Process sentiments
      ['highlights_sentiment', 'improvements_sentiment'].forEach(key => {
        if (responses[key]) {
          const sentiment = responses[key].toLowerCase();
          
          if (sentiment.includes('positive')) {
            positiveCount++;
          } else if (sentiment.includes('negative')) {
            negativeCount++;
          } else {
            neutralCount++;
          }
          
          // Extract topics (basic implementation - in a real app you'd use NLP)
          const topicMatches = sentiment.match(/topics?:?\s*([^.;]+)[.;]/i);
          if (topicMatches && topicMatches[1]) {
            const topics = topicMatches[1].split(',').map(t => t.trim());
            topics.forEach(topic => {
              if (topic) {
                const count = topicsMap.get(topic) || 0;
                topicsMap.set(topic, count + 1);
              }
            });
          }
        }
      });
    });
    
    // Calculate sentiment percentages
    const totalSentiments = positiveCount + neutralCount + negativeCount;
    const sentiments = {
      positive: totalSentiments > 0 ? Math.round((positiveCount / totalSentiments) * 100) : 0,
      neutral: totalSentiments > 0 ? Math.round((neutralCount / totalSentiments) * 100) : 0,
      negative: totalSentiments > 0 ? Math.round((negativeCount / totalSentiments) * 100) : 0,
    };
    
    // Get top topics
    const keyTopics = Array.from(topicsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);
    
    // Calculate response rate (basic estimate - would need actual attendee count)
    const responseRate = event.feedbackCount > 0 ? 
      Math.min(100, Math.round((feedbackResponses.length / event.feedbackCount) * 100)) : 0;
    
    return NextResponse.json({
      eventId,
      totalResponses: feedbackResponses.length,
      ratings,
      sentiments,
      keyTopics,
      responseRate,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching analytics' },
      { status: 500 }
    );
  }
} 