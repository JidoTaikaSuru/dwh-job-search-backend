# Phase 1: Build
FROM node:21-bullseye as build

COPY backendup.sh backendup.sh
COPY entrypoint.sh entrypoint.sh

ENTRYPOINT ["/bin/bash", "entrypoint.sh"]
