export interface Project {
  slug: string
  title: string
  summary: string
  problem: string
  role: string
  decision: string
  outcome: string
  tags: string[]
  link?: string
}

export const projects: Project[] = [
  {
    slug: 'elastic-cloud-application-scaling',
    title: 'Elastic Application Using Cloud Computing',
    summary: 'An application that scales itself based on real-time request volume and CPU usage.',
    problem: 'Applications need to handle variable load without manual intervention, and the scaling approach needed to work across more than one kind of cloud environment.',
    role: 'Designed and built the application and its scaling logic.',
    decision: 'Built auto-scaling targeting both a public cloud (AWS) and a hybrid cloud (OpenStack) rather than a single provider, so the scaling logic wasn’t tied to one platform’s specific APIs.',
    outcome: 'The application scaled automatically based on request volume and CPU usage across both AWS and OpenStack.',
    tags: ['Cloud Computing', 'AWS', 'OpenStack', 'Auto-scaling'],
  },
  {
    slug: 'multimedia-similarity-search-simulation',
    title: 'Multimedia Storage, Retrieval, and Similarity Simulation',
    summary: 'A simulated database comparing feature representation and indexing techniques for multimedia retrieval.',
    problem: 'Different feature representation, indexing, and classification techniques trade off differently for multimedia storage, retrieval, and similarity search, and those trade-offs needed to be evaluated concretely rather than assumed.',
    role: 'Built the simulation and ran the evaluation.',
    decision: 'Compared multiple feature representation, indexing, and classification techniques against the same dataset rather than committing to a single approach upfront.',
    outcome: 'Benchmarked similarity-search performance across techniques using a dataset of 4,000 images.',
    tags: ['Databases', 'Information Retrieval', 'Data Indexing'],
  },
]
