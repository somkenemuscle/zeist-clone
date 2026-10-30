// All landing-page copy lives here so sections stay purely presentational.

export type LifecycleStep = {
  id: 'create' | 'run' | 'fork' | 'pause' | 'restore'
  label: string
  command: string
  body: string
  note: string
}

export const lifecycle: LifecycleStep[] = [
  {
    id: 'create',
    label: 'Create',
    command: 'zeist box create agent --wait',
    body: 'Allocate compute and a root disk, ready for your code.',
    note: 'This illustrative sandbox is named agent. The command waits for the environment to be ready.',
  },
  {
    id: 'run',
    label: 'Run',
    command: 'zeist box exec agent -- python evaluate.py',
    body: 'Execute your script inside the runtime and write results where they persist.',
    note: 'evaluate.py represents your uploaded script. The execution and report.json shown here are illustrative, not live output.',
  },
  {
    id: 'fork',
    label: 'Fork',
    command: 'zeist box fork agent agent-branch',
    body: 'Copy live processes, memory, and the root disk into an independent runtime.',
    note: 'Fork copies a running sandbox. External Volume and Bucket mounts remain shared. Fork a Volume separately when its stored data also needs an independent copy.',
  },
  {
    id: 'pause',
    label: 'Pause',
    command: 'zeist box pause agent',
    body: 'Preserve a root disk checkpoint while compute stops.',
    note: 'Pause keeps the sandbox record resumable. Its checkpoint saves the root disk, not live processes or memory. Resume allocates compute again and restores the saved disk.',
  },
  {
    id: 'restore',
    label: 'Restore',
    command: 'zeist box create restored --checkpoint <id> --wait',
    body: 'Create a new runtime from a ready root disk checkpoint.',
    note: 'Replace <id> with a ready checkpoint ID. Files return, with fresh process space; live processes and memory are not restored.',
  },
]

export type Environment = {
  id: string
  label: string
  title: string
  body: string
  command: string
  recipe: string
}

export const environments: Environment[] = [
  {
    id: 'ubuntu',
    label: 'Ubuntu Base',
    title: 'A clean starting point.',
    body: 'Start with the base environment, then add the tools your workload needs.',
    command: 'zeist box create agent-workspace --wait',
    recipe: 'ubuntu-base',
  },
  {
    id: 'desktop',
    label: 'Linux Desktop',
    title: 'Give your agent a desktop.',
    body: 'Run workflows that need a full Linux desktop environment.',
    command: 'zeist box create desktop-session --os linux --wait',
    recipe: 'linux-desktop',
  },
  {
    id: 'image',
    label: 'Container image',
    title: 'Bring the dependencies.',
    body: 'Launch a public Linux container image, such as Python or Node, as your environment.',
    command: 'zeist box create agent-workspace --image python:3.12 --wait',
    recipe: 'python:3.12',
  },
  {
    id: 'template',
    label: 'Private template',
    title: 'Make a setup repeatable.',
    body: 'Launch your private VM template with the dependencies already in place.',
    command: 'zeist box create eval-run --template eval-worker:v1 --wait',
    recipe: 'eval-worker:v1',
  },
  {
    id: 'checkpoint',
    label: 'Saved checkpoint',
    title: 'Start where you left work.',
    body: 'Restore a ready checkpoint into a new sandbox with the saved root disk.',
    command: 'zeist box create next-run --checkpoint <checkpoint-id> --wait',
    recipe: 'checkpoint',
  },
]

export type StorageMode = {
  id: 'outputs' | 'shared' | 'fork' | 'bucket'
  label: string
  title: string
  body: string
  detail: string
}

export const storageModes: StorageMode[] = [
  {
    id: 'outputs',
    label: 'Keep outputs',
    title: 'The run ends. The work stays.',
    body: 'The runtime ends. report.json stays in run-results for the next run.',
    detail:
      'Managed Volumes are persistent object storage and survive sandbox deletion. Use a writable prefix for each run, such as training-a/. Publish writes with fsync before sharing or forking.',
  },
  {
    id: 'shared',
    label: 'Share datasets',
    title: 'One dataset. Every run.',
    body: 'Mount one managed Volume in multiple runtimes. Each environment sees the same stored dataset.',
    detail: 'Mounts are read only by default. Use one writer per file or prefix.',
  },
  {
    id: 'fork',
    label: 'Fork data',
    title: 'New experiment. Your own copy.',
    body: 'A Volume fork creates an independent copy of stored files. The source stays unchanged.',
    detail:
      'Publish writes before creating a Volume fork. Forking a sandbox keeps its external Volume and Bucket mounts shared; fork the Volume separately when the data also needs an independent copy.',
  },
  {
    id: 'bucket',
    label: 'Your bucket',
    title: 'Your bucket. Part of your runtime.',
    body: 'Connect an existing bucket and mount its files at /mnt/data. Your data stays with its provider.',
    detail:
      'Removing the Zeist connection leaves the upstream bucket and its data intact. Mounts default to read only.',
  },
]

export type BucketProvider = { name: string; logo: string }

export const bucketProviders: BucketProvider[] = [
  { name: 'AWS S3', logo: '/images/providers/aws-s3.png' },
  { name: 'Google Cloud Storage', logo: '/images/providers/google-cloud.png' },
  { name: 'Hetzner', logo: '/images/providers/hetzner.png' },
  { name: 'Tigris', logo: '/images/providers/tigris.jpg' },
  { name: 'Cloudflare R2', logo: '/images/providers/cloudflare-r2.png' },
]

export type ToolCall = { tool: string; label: string; target: string }

export type Workload = {
  id: 'agent' | 'rl' | 'eval' | 'data'
  label: string
  file: string
  command: string
  task: string
  summary: string
  calls: ToolCall[]
  output: { file: string; json: string }
}

export const workloads: Workload[] = [
  {
    id: 'agent',
    label: 'Agent',
    file: 'agent.py',
    command: 'python agent.py',
    task: 'Evaluate the records. Save a report.',
    summary: 'Read context, use tools, and save the result. Your agent drives the work.',
    calls: [
      { tool: 'file.read', label: 'Read evaluation records', target: '/mnt/data/eval.jsonl' },
      { tool: 'shell.execute', label: 'Run the evaluation', target: 'python evaluate.py' },
      { tool: 'file.write', label: 'Save the report', target: '/mnt/results/report.json' },
    ],
    output: {
      file: 'report.json',
      json: '{\n  "input": "eval.jsonl",\n  "checks": ["schema", "tool-use"],\n  "report": "saved"\n}',
    },
  },
  {
    id: 'rl',
    label: 'RL training',
    file: 'train.py',
    command: 'python train.py',
    task: 'Run your training loop. Keep the artifact.',
    summary: 'Collect experience, update a policy, and save the checkpoint.',
    calls: [
      { tool: 'env.rollout', label: 'Collect experience', target: '2,048 steps' },
      { tool: 'policy.update', label: 'Update the policy', target: 'epoch 12 / 12' },
      { tool: 'file.write', label: 'Save the checkpoint', target: '/mnt/results/policy.pt' },
    ],
    output: {
      file: 'policy.pt',
      json: '{\n  "artifact": "policy.pt",\n  "prefix": "training-a/",\n  "status": "published"\n}',
    },
  },
  {
    id: 'eval',
    label: 'Evaluation',
    file: 'evaluate.py',
    command: 'python evaluate.py',
    task: 'Run your evaluation cases together.',
    summary: 'Run eval.jsonl and preserve the case results for your next decision.',
    calls: [
      { tool: 'file.read', label: 'Load the cases', target: '/mnt/data/eval.jsonl' },
      { tool: 'shell.execute', label: 'Score each case', target: 'python evaluate.py' },
      { tool: 'file.write', label: 'Keep the results', target: '/mnt/results/evaluation.json' },
    ],
    output: {
      file: 'evaluation.json',
      json: '{\n  "cases": "eval.jsonl",\n  "results": "preserved",\n  "next": "ready"\n}',
    },
  },
  {
    id: 'data',
    label: 'Data preparation',
    file: 'prepare.py',
    command: 'python prepare.py',
    task: 'Turn source records into the next dataset.',
    summary: 'Transform source records into the dataset your next run needs.',
    calls: [
      { tool: 'file.read', label: 'Read source records', target: '/mnt/data/source/' },
      { tool: 'shell.execute', label: 'Clean and transform', target: 'python prepare.py' },
      { tool: 'file.write', label: 'Publish the dataset', target: '/mnt/results/prepared.jsonl' },
    ],
    output: {
      file: 'prepared.jsonl',
      json: '{\n  "source": "records",\n  "output": "prepared.jsonl",\n  "for": "next run"\n}',
    },
  },
]

export const dockerfile = [
  'FROM zeist/ubuntu',
  'WORKDIR /workspace',
  'COPY requirements.txt .',
  'RUN pip install -r requirements.txt',
  'COPY evaluate.py .',
]

export const buildSteps = [
  'Resolve supported base',
  'Install dependencies',
  'Package evaluate.py',
  'Register private template',
]

export const faqs = [
  {
    q: 'Can I try Zeist now?',
    a: 'Zeist is in early access. Join the waitlist to request access and tell us what you are building.',
  },
  {
    q: 'What can I run?',
    a: 'Run AI agents, reinforcement learning experiments, model evaluations, and data preparation workloads. Start from Ubuntu Base, Linux Desktop, a public Linux container image, a private template, or a saved checkpoint. Bring the tools and dependencies your work needs.',
  },
  {
    q: 'What stays between runs?',
    a: 'Managed Volumes preserve data beyond sandbox deletion. Pause and checkpoints save the root disk. A fork copies the running sandbox, while external Volume and Bucket mounts remain shared. Mounts are read only by default.',
  },
  {
    q: 'Can I bring my own storage?',
    a: 'Yes. Connect an existing bucket from AWS S3, Google Cloud Storage, Hetzner, Tigris, or Cloudflare R2 and mount it into your runtime. Your bucket stays with its provider. Removing the Zeist connection does not delete the upstream bucket or its data.',
  },
  {
    q: 'How long can a sandbox run?',
    a: 'The current timeout limit is 24 hours. Extend a sandbox within that limit, or restore a saved checkpoint into a new sandbox for the next session.',
  },
  {
    q: 'Are preview URLs private?',
    a: 'Public HTTPS endpoints are unauthenticated. For access through your local machine, use a private CLI tunnel instead. Outbound domain and CIDR rules let you control network access.',
  },
  {
    q: 'Can my agent control Zeist?',
    a: 'Yes. Use the CLI or REST API to create environments, execute code, and manage runtime resources programmatically. The dashboard lets you inspect and manage those same resources.',
  },
]
