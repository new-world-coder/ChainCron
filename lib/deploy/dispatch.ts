export async function dispatchDeploy({ workflowId, versionId, deploymentId }: {
  workflowId: string;
  versionId: string;
  deploymentId: string;
}) {
  const GH_TOKEN = process.env.GH_ACTIONS_TOKEN;
  const REPO = process.env.GH_REPO || 'new-world-coder/ChainCron';
  
  if (!GH_TOKEN) {
    console.warn('GitHub Actions token not configured, skipping dispatch');
    return;
  }
  
  try {
    await fetch(
      `https://api.github.com/repos/${REPO}/actions/workflows/testnet-deploy.yml/dispatches`,
      {
        method: 'POST',
        headers: { 
          Authorization: `token ${GH_TOKEN}`, 
          'Content-Type':'application/json' 
        },
        body: JSON.stringify({ 
          ref: 'main', 
          inputs: { workflowId, versionId, deploymentId } 
        })
      }
    );
  } catch (error) {
    console.error('Failed to dispatch deployment:', error);
  }
}

