import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import connectToDatabase from '../../utils/database';
import Event from '../../models/event.schema';
import { requireAuth, requireRole } from '../../utils/auth';
import slugify from 'slugify';

// GET - List events
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { user } = authResult;
    
    await connectToDatabase();
    
    // Query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = {};
    
    // Add search if provided
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // If not admin, only show own events
    if (user.role !== 'admin') {
      query.organizerId = user.id;
    }
    
    // Get events
    const events = await Event.find(query)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Event.countDocuments(query);
    
    return NextResponse.json({
      events,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching events' },
      { status: 500 }
    );
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { user } = authResult;
    
    await connectToDatabase();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'startDate', 'endDate', 'location'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Validate dates
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }
    
    if (endDate < startDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }
    
    // Generate slug
    let slug = slugify(body.name, { lower: true, strict: true });
    
    // Check if slug already exists
    const slugExists = await Event.findOne({ slug });
    if (slugExists) {
      // Append random string to make unique
      slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
    }
    
    // Create new event
    const event = new Event({
      ...body,
      slug,
      organizerId: user.id,
      startDate,
      endDate,
      feedbackCount: 0,
    });
    
    await event.save();
    
    return NextResponse.json({
      success: true,
      event,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the event' },
      { status: 500 }
    );
  }
} 