DELETE FROM daily_ideas
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY tag ORDER BY is_featured DESC, created_at ASC) as rn
    FROM daily_ideas
    WHERE date = CURRENT_DATE
  ) ranked
  WHERE rn > 10
)