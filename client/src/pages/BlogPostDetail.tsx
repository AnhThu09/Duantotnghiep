import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Grid, Divider } from '@mui/material';

const API_URL = 'http://localhost:3000/api/posts';
const UPLOADS_URL = 'http://localhost:3000/uploads/';

const PostDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [popularPosts, setPopularPosts] = useState([]);

useEffect(() => {
  axios.get(`${API_URL}/slug/${slug}`).then((res) => setPost(res.data));
  axios.get(API_URL).then((res) => setPopularPosts(res.data.slice(0, 5)));
}, [slug]);


  if (!post) return <p>Đang tải...</p>;

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: 6 }}>
      <Grid container spacing={6}>
        {/* Cột trái */}
        <Grid item xs={12} md={8}>
          <Typography variant="caption" color="text.secondary">
            COCOON | {new Date(post.created_at).toLocaleDateString('vi-VN')}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, mb: 2 }}>
            {post.title}
          </Typography>
          <Typography variant="subtitle2" fontStyle="italic" mb={3}>
            By Chí Cường Nguyễn
          </Typography>
          <Box
            component="img"
            src={UPLOADS_URL + post.thumbnail}
            alt={post.title}
            sx={{ width: '100%', borderRadius: 2, mb: 3 }}
          />
          <Box dangerouslySetInnerHTML={{ __html: post.content }} />
        </Grid>

        {/* Cột phải */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Bài viết phổ biến
          </Typography>
          {popularPosts.map((p) => (
            <Box key={p.post_id} sx={{ display: 'flex', mb: 2 }}>
              <Box
                component="img"
                src={UPLOADS_URL + p.thumbnail}
                alt={p.title}
                sx={{ width: 80, height: 80, objectFit: 'cover', mr: 2, borderRadius: 1 }}
              />
              <Box>
                <Typography variant="subtitle2" fontWeight={600} noWrap>
                  {p.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {p.content.replace(/<[^>]+>/g, '').slice(0, 60)}...
                </Typography>
              </Box>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PostDetailPage;
