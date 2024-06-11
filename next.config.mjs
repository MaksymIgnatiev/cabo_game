/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: config => {
		config.module.rules.push({
			test: /server\.ts$/,
			use: ["@svgr/webpack"],
		})

		return config
	},
}

export default nextConfig
