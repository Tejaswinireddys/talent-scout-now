
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ResumeProfile {
  id: string;
  title: string;
  content: string;
  skills: string[];
  experience_years: number;
  education: string;
  certifications: string[];
  is_primary: boolean;
  created_at: string;
}

export const useResume = () => {
  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState<ResumeProfile[]>([]);
  const { user } = useAuth();

  const createResume = async (resumeData: Omit<ResumeProfile, 'id' | 'created_at'>) => {
    if (!user) return { error: 'User not authenticated' };

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('resume_profiles')
        .insert({
          user_id: user.id,
          ...resumeData
        })
        .select()
        .single();

      if (error) throw error;

      await getResumes();
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating resume:', error);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateResume = async (id: string, resumeData: Partial<ResumeProfile>) => {
    if (!user) return { error: 'User not authenticated' };

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('resume_profiles')
        .update(resumeData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      await getResumes();
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating resume:', error);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getResumes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('resume_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setResumes(data || []);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  const deleteResume = async (id: string) => {
    if (!user) return { error: 'User not authenticated' };

    setLoading(true);
    try {
      const { error } = await supabase
        .from('resume_profiles')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await getResumes();
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting resume:', error);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    resumes,
    createResume,
    updateResume,
    getResumes,
    deleteResume
  };
};
