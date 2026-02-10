module.exports = {
    apps: [
        {
            name: 'agribook-admin',
            cwd: './admin',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: 'production',
                PORT: 3001
            }
        },
        {
            name: 'agribook-website',
            cwd: './website-next',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: 'production',
                PORT: 3002
            }
        },
        {
            name: 'agribook-proxy',
            script: './server.js',
            env: {
                NODE_ENV: 'production',
                PORT: 3000
            }
        }
    ]
};
