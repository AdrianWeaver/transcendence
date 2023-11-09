/* eslint-disable max-len */
/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import svgr from "vite-plugin-svgr";
import dotenv from "dotenv";

dotenv.config();
// load env vars from .env
// https://vitejs.dev/config/
export default defineConfig({
	define: {
		__HOST_PROTOCOL__: `"${process.env.HOST_PROTOCOL}"`,
		__HOST_LOCATION__: `"${process.env.HOST_LOCATION}"`,
		__REDIRECT_PROTOCOL__: `"${process.env.REDIRECT_PROTOCOL}"`,
		__REDIRECT_DOMAIN__: `"${process.env.REDIRECT_DOMAIN}"`
		// wrapping in "" since it's a string
	},
	plugins:
	[react()],
});
