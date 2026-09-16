# TIBO PLS - Static site (nginx)
FROM nginx:1.27-alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy static files
COPY index.html robots.txt /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

# Custom nginx config (security headers + caching)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Non-root friendly (optional, alpine nginx already drops privileges)
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ > /dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
