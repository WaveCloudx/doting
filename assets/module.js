

const path = require("path");
global.path = path

const fs = require("fs");
global.fs = fs

const { spawn } = require('child_process');
global.spawn = spawn

const { Telegraf } = require('telegraf');
global.Telegraf = Telegraf

const express = require('express');
global.express = express

const multer = require('multer');
global.multer = multer

const moment = require('moment');
global.moment = moment

const si = require('systeminformation');
global.si = si