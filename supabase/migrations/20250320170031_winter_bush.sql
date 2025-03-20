/*
  # Create analysis history table

  1. New Tables
    - `analysis_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `file_name` (text)
      - `results` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `analysis_history` table
    - Add policies for users to:
      - Read their own analysis history
      - Create new analysis records
*/

CREATE TABLE IF NOT EXISTS analysis_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  file_name text NOT NULL,
  results jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own analysis history"
  ON analysis_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create analysis records"
  ON analysis_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);