db.createUser({
  user: 'strapi',
  pwd: 'password',
  roles: [
    {
      role: 'readWrite',
      db: 'strapi'
    }
  ]
})
