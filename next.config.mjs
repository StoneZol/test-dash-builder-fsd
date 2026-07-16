import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(
    fileURLToPath(import.meta.url),
);

/** @type {import('next').NextConfig} */
const nextConfig = {
    sassOptions: {
        includePaths: [
            path.join(__dirname, "4_shared/styles"),
        ],
    },
    webpack(config) {
        config.resolve.alias = {
            ...config.resolve.alias,
            "@styles": path.join(
                __dirname,
                "4_shared/styles",
            ),
        };
        return config;
    },
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "flagcdn.com" },
            { protocol: "https", hostname: "flags.restcountries.com" },
            {
                protocol: "https",
                hostname: "upload.wikimedia.org",
            },
        ],
    },
};

export default nextConfig;
