/** @type {import('next').NextConfig} */
const nextConfig = {
  // Native/ONNX packages used for local embeddings must not be bundled.
  serverExternalPackages: ["@huggingface/transformers", "onnxruntime-node", "sharp"],
};

export default nextConfig;
