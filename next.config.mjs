/** @type {import('next').NextConfig} */
var nextConfig = {
	webpack: config => {
		config.module.rules.push({
			test: /server\.ts$/,
			use: ["@svgr/webpack"],
		})

		return config
	},
}

export default nextConfig
