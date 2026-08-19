export type DeploymentEnvironment = "local" | "staging" | "production";

const headerAddButtonClassNames: Record<DeploymentEnvironment, string | undefined> = {
  local:
    "bg-zinc-800 text-white hover:bg-zinc-700 focus-visible:ring-zinc-500/40",
  staging:
    "bg-amber-400 text-amber-950 hover:bg-amber-300 focus-visible:ring-amber-500/40",
  production: undefined,
};

export function getDeploymentEnvironment(
  value = process.env.CRM_DEPLOYMENT_ENV,
): DeploymentEnvironment {
  if (value === "staging" || value === "production") {
    return value;
  }

  return "local";
}

export function getHeaderAddButtonClassName(
  environment: DeploymentEnvironment,
) {
  return headerAddButtonClassNames[environment];
}
