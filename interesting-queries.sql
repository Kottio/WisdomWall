-- WisdomWall Database Analytics Queries for Video Demo
-- These queries showcase interesting insights from the database

-- ============================================
-- 1. STUDENT LEADERBOARD - Top Contributors
-- ============================================
-- Shows students ranked by total engagement (advice posted, likes received, comments received)
SELECT
    s.username,
    s.position,
    COUNT(DISTINCT a.id) as advice_count,
    COUNT(DISTINCT al.id) as total_likes_received,
    COUNT(DISTINCT ac.id) as total_comments_received,
    (COUNT(DISTINCT a.id) * 10 +
     COUNT(DISTINCT al.id) * 3 +
     COUNT(DISTINCT ac.id) * 5) as engagement_score
FROM student s
LEFT JOIN advice a ON s.id = a."studentId"
LEFT JOIN advice_like al ON a.id = al."adviceId"
LEFT JOIN advice_comment ac ON a.id = ac."adviceId"
GROUP BY s.id, s.username, s.position
ORDER BY engagement_score DESC
LIMIT 10;

-- ============================================
-- 2. TRENDING ADVICE - Most Popular Posts
-- ============================================
-- Shows advice with highest engagement, including author info
SELECT
    a.id,
    a.message,
    a.category,
    s.username as author,
    s.position as author_position,
    COUNT(DISTINCT al.id) as like_count,
    COUNT(DISTINCT ac.id) as comment_count,
    a."createdAt",
    -- Trending score: likes * 2 + comments * 3, weighted by recency
    (COUNT(DISTINCT al.id) * 2 + COUNT(DISTINCT ac.id) * 3) *
    (1.0 / (EXTRACT(EPOCH FROM (NOW() - a."createdAt")) / 86400.0 + 1)) as trending_score
FROM advice a
JOIN student s ON a."studentId" = s.id
LEFT JOIN advice_like al ON a.id = al."adviceId"
LEFT JOIN advice_comment ac ON a.id = ac."adviceId"
GROUP BY a.id, a.message, a.category, s.username, s.position, a."createdAt"
ORDER BY trending_score DESC
LIMIT 15;

-- ============================================
-- 3. CATEGORY ANALYTICS - Popular Topics
-- ============================================
-- Shows which advice categories are most popular
SELECT
    a.category,
    COUNT(DISTINCT a.id) as advice_count,
    COUNT(DISTINCT al.id) as total_likes,
    COUNT(DISTINCT ac.id) as total_comments,
    ROUND(AVG(likes_per_advice.like_count), 2) as avg_likes_per_advice,
    STRING_AGG(DISTINCT s.position, ', ') as top_contributor_positions
FROM advice a
LEFT JOIN advice_like al ON a.id = al."adviceId"
LEFT JOIN advice_comment ac ON a.id = ac."adviceId"
JOIN student s ON a."studentId" = s.id
LEFT JOIN LATERAL (
    SELECT COUNT(*) as like_count
    FROM advice_like al2
    WHERE al2."adviceId" = a.id
) likes_per_advice ON true
GROUP BY a.category
HAVING COUNT(DISTINCT a.id) > 0
ORDER BY total_likes DESC;

-- ============================================
-- 4. ACTIVITY TIMELINE - Daily Engagement
-- ============================================
-- Shows daily activity trends (advice posts, likes, comments)
SELECT
    DATE(a."createdAt") as date,
    COUNT(DISTINCT a.id) as new_advice,
    COUNT(DISTINCT al.id) as new_likes,
    COUNT(DISTINCT ac.id) as new_comments,
    COUNT(DISTINCT a."studentId") as active_students
FROM advice a
LEFT JOIN advice_like al ON a.id = al."adviceId" AND DATE(al."createdAt") = DATE(a."createdAt")
LEFT JOIN advice_comment ac ON a.id = ac."adviceId" AND DATE(ac."createdAt") = DATE(a."createdAt")
WHERE a."createdAt" >= NOW() - INTERVAL '30 days'
GROUP BY DATE(a."createdAt")
ORDER BY date DESC;

-- ============================================
-- 5. ENGAGEMENT NETWORK - Who's Interacting
-- ============================================
-- Shows which students are engaging with each other's content
SELECT
    s_author.username as advice_author,
    s_author.position as author_position,
    s_engager.username as engaging_student,
    s_engager.position as engager_position,
    COUNT(DISTINCT al.id) as likes_given,
    COUNT(DISTINCT ac.id) as comments_given,
    COUNT(DISTINCT al.id) + COUNT(DISTINCT ac.id) as total_interactions
FROM advice a
JOIN student s_author ON a."studentId" = s_author.id
LEFT JOIN advice_like al ON a.id = al."adviceId"
LEFT JOIN advice_comment ac ON a.id = ac."adviceId"
LEFT JOIN student s_engager ON (al."studentId" = s_engager.id OR ac."studentId" = s_engager.id)
WHERE s_engager.id IS NOT NULL AND s_author.id != s_engager.id
GROUP BY s_author.id, s_author.username, s_author.position, s_engager.id, s_engager.username, s_engager.position
HAVING COUNT(DISTINCT al.id) + COUNT(DISTINCT ac.id) > 0
ORDER BY total_interactions DESC
LIMIT 20;

-- ============================================
-- 6. COMPREHENSIVE PLATFORM STATS
-- ============================================
-- Overall platform statistics
SELECT
    (SELECT COUNT(*) FROM student) as total_students,
    (SELECT COUNT(*) FROM advice) as total_advice,
    (SELECT COUNT(*) FROM advice_like) as total_likes,
    (SELECT COUNT(*) FROM advice_comment) as total_comments,
    (SELECT COUNT(DISTINCT category) FROM advice) as unique_categories,
    ROUND((SELECT COUNT(*)::float FROM advice_like) /
          NULLIF((SELECT COUNT(*)::float FROM advice), 0), 2) as avg_likes_per_advice,
    ROUND((SELECT COUNT(*)::float FROM advice_comment) /
          NULLIF((SELECT COUNT(*)::float FROM advice), 0), 2) as avg_comments_per_advice,
    (SELECT username FROM student s
     JOIN advice a ON s.id = a."studentId"
     LEFT JOIN advice_like al ON a.id = al."adviceId"
     GROUP BY s.id, s.username
     ORDER BY COUNT(DISTINCT al.id) DESC
     LIMIT 1) as most_liked_student;

-- ============================================
-- 7. EVENT ANALYTICS - User Behavior Tracking
-- ============================================
-- Analyze events to understand user behavior patterns
SELECT
    e."eventName",
    COUNT(*) as event_count,
    COUNT(DISTINCT e."studentId") as unique_students,
    COUNT(DISTINCT e."sessionId") as unique_sessions,
    COUNT(DISTINCT e."adviceId") as unique_advice_affected,
    DATE(e."createdAt") as event_date
FROM event e
WHERE e."createdAt" >= NOW() - INTERVAL '7 days'
GROUP BY e."eventName", DATE(e."createdAt")
ORDER BY event_date DESC, event_count DESC;

-- ============================================
-- 8. STUDENT INFLUENCE SCORE
-- ============================================
-- Advanced scoring: considers advice quality, engagement received, and social reach
WITH student_metrics AS (
    SELECT
        s.id,
        s.username,
        s.position,
        COUNT(DISTINCT a.id) as advice_count,
        COUNT(DISTINCT al.id) as likes_received,
        COUNT(DISTINCT ac.id) as comments_received,
        COUNT(DISTINCT ac."studentId") as unique_commenters,
        COUNT(DISTINCT al."studentId") as unique_likers,
        AVG(EXTRACT(EPOCH FROM (NOW() - a."createdAt")) / 86400.0) as avg_advice_age_days
    FROM student s
    LEFT JOIN advice a ON s.id = a."studentId"
    LEFT JOIN advice_like al ON a.id = al."adviceId"
    LEFT JOIN advice_comment ac ON a.id = ac."adviceId"
    GROUP BY s.id, s.username, s.position
)
SELECT
    username,
    position,
    advice_count,
    likes_received,
    comments_received,
    unique_likers as social_reach,
    ROUND(
        (advice_count * 5.0) +
        (likes_received * 1.0) +
        (comments_received * 2.0) +
        (unique_likers * 3.0) +
        (unique_commenters * 4.0) -
        (COALESCE(avg_advice_age_days, 0) * 0.1)
    , 2) as influence_score
FROM student_metrics
ORDER BY influence_score DESC
LIMIT 15;

-- ============================================
-- 9. CATEGORY CROSS-POLLINATION
-- ============================================
-- Shows which students engage across multiple categories
SELECT
    s.username,
    s.position,
    COUNT(DISTINCT a_authored.category) as categories_posted_in,
    COUNT(DISTINCT a_liked.category) as categories_liked,
    STRING_AGG(DISTINCT a_authored.category, ', ') as posted_categories,
    COUNT(DISTINCT a_authored.id) as total_advice,
    COUNT(DISTINCT al.id) as total_likes_given
FROM student s
LEFT JOIN advice a_authored ON s.id = a_authored."studentId"
LEFT JOIN advice_like al ON s.id = al."studentId"
LEFT JOIN advice a_liked ON al."adviceId" = a_liked.id
GROUP BY s.id, s.username, s.position
HAVING COUNT(DISTINCT a_authored.category) > 1 OR COUNT(DISTINCT a_liked.category) > 1
ORDER BY categories_posted_in DESC, categories_liked DESC;

-- ============================================
-- 10. RECENT HOT DISCUSSIONS
-- ============================================
-- Advice that has received activity in the last 24 hours
SELECT
    a.id,
    SUBSTRING(a.message, 1, 100) || '...' as message_preview,
    a.category,
    s.username as author,
    COUNT(DISTINCT recent_likes.id) as likes_last_24h,
    COUNT(DISTINCT recent_comments.id) as comments_last_24h,
    COUNT(DISTINCT all_likes.id) as total_likes,
    COUNT(DISTINCT all_comments.id) as total_comments,
    a."createdAt" as posted_at
FROM advice a
JOIN student s ON a."studentId" = s.id
LEFT JOIN advice_like all_likes ON a.id = all_likes."adviceId"
LEFT JOIN advice_comment all_comments ON a.id = all_comments."adviceId"
LEFT JOIN advice_like recent_likes ON a.id = recent_likes."adviceId"
    AND recent_likes."createdAt" >= NOW() - INTERVAL '24 hours'
LEFT JOIN advice_comment recent_comments ON a.id = recent_comments."adviceId"
    AND recent_comments."createdAt" >= NOW() - INTERVAL '24 hours'
WHERE recent_likes.id IS NOT NULL OR recent_comments.id IS NOT NULL
GROUP BY a.id, a.message, a.category, s.username, a."createdAt"
ORDER BY (COUNT(DISTINCT recent_likes.id) + COUNT(DISTINCT recent_comments.id)) DESC
LIMIT 10;
