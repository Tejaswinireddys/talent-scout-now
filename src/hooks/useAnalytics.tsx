
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AnalyticsEvent {
  id: string;
  event_type: string;
  event_data: any;
  created_at: string;
}

export const useAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const { user } = useAuth();

  const trackEvent = async (eventType: string, eventData?: any) => {
    if (!user) return;

    try {
      await supabase
        .from('analytics_events')
        .insert({
          user_id: user.id,
          event_type: eventType,
          event_data: eventData
        });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  const getAnalytics = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventCounts = () => {
    const counts: Record<string, number> = {};
    events.forEach(event => {
      counts[event.event_type] = (counts[event.event_type] || 0) + 1;
    });
    return counts;
  };

  useEffect(() => {
    if (user) {
      getAnalytics();
    }
  }, [user]);

  return {
    loading,
    events,
    trackEvent,
    getAnalytics,
    getEventCounts
  };
};
