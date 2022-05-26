#!/bin/bash
node -v 
aws s3 sync /var/www/be-post-admin/output s3://cms.timebird.org
