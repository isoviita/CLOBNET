#!/bin/bash
sudo -u postgres psql -d research -c "\i '/clobnet/v0.8/sql/export.sql'"
sudo chown -R clobnet:clobnet /clobnet/v0.8/export/