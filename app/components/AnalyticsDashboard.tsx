'use client';

import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

type AnalyticsData = {
  eventId: string;
  totalResponses: number;
  ratings: {
    overall: number[];
    content: number[];
    speakers: number[];
    venue: number[];
  };
  sentiments: {
    positive: number;
    neutral: number;
    negative: number;
  };
  keyTopics: string[];
  responseRate: number;
};

type AnalyticsDashboardProps = {
  eventId: string;
};

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ eventId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Fetch analytics data from API
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/analytics?eventId=${eventId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch analytics data');
        }
        
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId]);

  // Calculate average ratings
  const averageRatings = data ? {
    overall: data.ratings.overall.length > 0
      ? parseFloat((data.ratings.overall.reduce((sum, val) => sum + val, 0) / data.ratings.overall.length).toFixed(1))
      : 0,
    content: data.ratings.content.length > 0
      ? parseFloat((data.ratings.content.reduce((sum, val) => sum + val, 0) / data.ratings.content.length).toFixed(1))
      : 0,
    speakers: data.ratings.speakers.length > 0
      ? parseFloat((data.ratings.speakers.reduce((sum, val) => sum + val, 0) / data.ratings.speakers.length).toFixed(1))
      : 0,
    venue: data.ratings.venue.length > 0
      ? parseFloat((data.ratings.venue.reduce((sum, val) => sum + val, 0) / data.ratings.venue.length).toFixed(1))
      : 0,
  } : {
    overall: 0,
    content: 0,
    speakers: 0,
    venue: 0,
  };

  // Bar chart data for ratings
  const ratingsChartData = {
    labels: ['Overall Experience', 'Content Quality', 'Speakers', 'Venue'],
    datasets: [
      {
        label: 'Average Rating (1-5)',
        data: [
          averageRatings.overall,
          averageRatings.content,
          averageRatings.speakers,
          averageRatings.venue,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Pie chart data for sentiment analysis
  const sentimentChartData = data ? {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          data.sentiments.positive,
          data.sentiments.neutral,
          data.sentiments.negative,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  } : {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Feedback Analytics</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <p className="font-medium">Error loading analytics</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm font-medium text-white bg-red-600 py-1 px-3 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : !data ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No data available for this event.</p>
        </div>
      ) : (
        <div>
          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 ${
                activeTab === 'overview' 
                  ? 'border-b-2 border-primary-500 text-primary-700 font-medium' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === 'ratings' 
                  ? 'border-b-2 border-primary-500 text-primary-700 font-medium' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('ratings')}
            >
              Ratings
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === 'sentiment' 
                  ? 'border-b-2 border-primary-500 text-primary-700 font-medium' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('sentiment')}
            >
              Sentiment
            </button>
          </div>
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Key Stats */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Response Rate</h3>
                  <p className="text-2xl font-semibold text-gray-900">{data.responseRate}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Total Responses</h3>
                  <p className="text-2xl font-semibold text-gray-900">{data.totalResponses}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
                  <p className="text-2xl font-semibold text-gray-900">{averageRatings.overall}/5</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Positive Sentiment</h3>
                  <p className="text-2xl font-semibold text-gray-900">{data.sentiments.positive}%</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Rating Summary</h3>
                  <div className="h-64">
                    <Bar 
                      data={ratingsChartData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 5,
                          },
                        },
                      }} 
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Sentiment Analysis</h3>
                  <div className="h-64">
                    <Pie 
                      data={sentimentChartData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Key Topics Mentioned</h3>
                {data.keyTopics.length > 0 ? (
                  <div className="space-y-2">
                    {data.keyTopics.map((topic, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        {topic}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No key topics identified yet.</p>
                )}
              </div>
            </div>
          )}
          
          {/* Ratings Tab */}
          {activeTab === 'ratings' && (
            <div>
              <div className="h-80">
                <Bar 
                  data={ratingsChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 5,
                      },
                    },
                    plugins: {
                      title: {
                        display: true,
                        text: 'Average Ratings by Category',
                      },
                    },
                  }} 
                />
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(data.ratings).map(([key, values]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium capitalize">{key}</h3>
                    <p className="text-2xl font-semibold">
                      {values.length > 0 
                        ? (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1) 
                        : '0'}/5
                    </p>
                    <div className="mt-2 flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary-500 h-2.5 rounded-full" 
                          style={{ 
                            width: `${values.length > 0 
                              ? ((values.reduce((sum, val) => sum + val, 0) / values.length) / 5) * 100 
                              : 0}%` 
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {values.length} responses
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Sentiment Tab */}
          {activeTab === 'sentiment' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Sentiment Distribution</h3>
                  <div className="h-64">
                    <Pie 
                      data={sentimentChartData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                        },
                      }} 
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Sentiment Breakdown</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between">
                        <span>Positive</span>
                        <span>{data.sentiments.positive}%</span>
                      </div>
                      <div className="mt-1 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-500 h-2.5 rounded-full" 
                          style={{ width: `${data.sentiments.positive}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Neutral</span>
                        <span>{data.sentiments.neutral}%</span>
                      </div>
                      <div className="mt-1 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-500 h-2.5 rounded-full" 
                          style={{ width: `${data.sentiments.neutral}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Negative</span>
                        <span>{data.sentiments.negative}%</span>
                      </div>
                      <div className="mt-1 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-red-500 h-2.5 rounded-full" 
                          style={{ width: `${data.sentiments.negative}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Key Topics</h3>
                {data.keyTopics.length > 0 ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-4">
                      Based on sentiment analysis of feedback responses, the following key topics were mentioned:
                    </p>
                    <ul className="space-y-2">
                      {data.keyTopics.map((topic, index) => (
                        <li key={index} className="flex items-start">
                          <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-2 text-sm">#</span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No key topics identified yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard; 