import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../backend/src/schema.gql",
  documents: ["src/graphql/**/*.ts"],
  ignoreNoDocuments: true,
  generates: {
    "./src/gql/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
