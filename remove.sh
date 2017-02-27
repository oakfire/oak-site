#!/bin/bash
find deb -type f | sed "s|deb|/|" | xargs rm
