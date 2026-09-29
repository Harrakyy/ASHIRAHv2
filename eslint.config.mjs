import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      "plugin/**",
      "scripts/**",
      // Komponen vendor hasil generate shadcn/ui & Magic UI — tidak diubah manual
      "components/ui/**",
      "components/magicui/**",
      "hooks/use-mobile.ts",
    ],
  },
]

export default eslintConfig
