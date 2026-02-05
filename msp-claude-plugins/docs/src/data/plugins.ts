export interface Plugin {
  id: string;
  name: string;
  vendor: string;
  description: string;
  category: 'psa' | 'rmm' | 'documentation';
  features: string[];
  skills: Skill[];
  commands: Command[];
  apiInfo: ApiInfo;
  path: string;
}

export interface Skill {
  name: string;
  description: string;
}

export interface Command {
  name: string;
  description: string;
}

export interface ApiInfo {
  baseUrl: string;
  auth: string;
  rateLimit: string;
  docsUrl: string;
}

export const plugins: Plugin[] = [
  {
    id: 'autotask',
    name: 'Autotask PSA',
    vendor: 'Kaseya',
    description: 'Professional Services Automation for ticket management, CRM, projects, contracts, and time tracking.',
    category: 'psa',
    features: [
      'Ticket Management',
      'CRM Operations',
      'Project Management',
      'Contract Management',
      'Time Entry'
    ],
    skills: [
      { name: 'tickets', description: 'Service ticket management and workflows' },
      { name: 'crm', description: 'Company and contact management' },
      { name: 'projects', description: 'Project and task management' },
      { name: 'contracts', description: 'Service agreement and billing' },
      { name: 'api-patterns', description: 'Common Autotask API patterns' }
    ],
    commands: [
      { name: '/create-ticket', description: 'Create a new service ticket' },
      { name: '/search-tickets', description: 'Search for tickets by criteria' },
      { name: '/update-ticket', description: 'Update ticket fields (status, priority, queue, due date, assignee)' },
      { name: '/add-note', description: 'Add internal or public notes to tickets' },
      { name: '/my-tickets', description: 'List tickets assigned to current user with filtering' },
      { name: '/lookup-company', description: 'Search companies by name or ID' },
      { name: '/lookup-contact', description: 'Search contacts by name, email, phone, or company' },
      { name: '/lookup-asset', description: 'Search configuration items/assets' },
      { name: '/check-contract', description: 'View contract status and entitlements' },
      { name: '/reassign-ticket', description: 'Reassign ticket to different resource or queue' },
      { name: '/time-entry', description: 'Log time against a ticket or project' }
    ],
    apiInfo: {
      baseUrl: 'https://webservicesX.autotask.net/atservicesrest/v1.0',
      auth: 'API Integration Code + Username + Secret',
      rateLimit: '10,000 requests per hour',
      docsUrl: 'https://ww5.autotask.net/help/DeveloperHelp/Content/APIs/REST/REST_API_Home.htm'
    },
    path: 'kaseya/autotask'
  },
  {
    id: 'datto-rmm',
    name: 'Datto RMM',
    vendor: 'Kaseya',
    description: 'Remote Monitoring and Management for device management, alerts, jobs, and automation.',
    category: 'rmm',
    features: [
      'Device Management',
      'Alert Handling',
      'Site Management',
      'Job Execution',
      'Audit Data'
    ],
    skills: [
      { name: 'devices', description: 'Device management, status monitoring, user-defined fields' },
      { name: 'alerts', description: 'Alert handling with 25+ context types' },
      { name: 'sites', description: 'Site management and configuration' },
      { name: 'jobs', description: 'Quick job execution and component scripts' },
      { name: 'audit', description: 'Hardware and software inventory' },
      { name: 'variables', description: 'Account and site-level variables' },
      { name: 'api-patterns', description: 'Authentication, pagination, error handling' }
    ],
    commands: [
      { name: '/device-lookup', description: 'Find a device by hostname, IP, or MAC address' },
      { name: '/resolve-alert', description: 'Resolve open alerts' },
      { name: '/run-job', description: 'Run a quick job on a device' },
      { name: '/site-devices', description: 'List devices at a site' }
    ],
    apiInfo: {
      baseUrl: 'https://{platform}-api.centrastage.net',
      auth: 'API Key + Secret',
      rateLimit: '600 requests per minute',
      docsUrl: 'https://rmm.datto.com/help/en/Content/2SETUP/APIv2.htm'
    },
    path: 'kaseya/datto-rmm'
  },
  {
    id: 'it-glue',
    name: 'IT Glue',
    vendor: 'Kaseya',
    description: 'Documentation platform for organizations, assets, passwords, and flexible documentation.',
    category: 'documentation',
    features: [
      'Organization Management',
      'Configuration Items',
      'Contact Management',
      'Password Management',
      'Documentation',
      'Flexible Assets'
    ],
    skills: [
      { name: 'organizations', description: 'Organization (company/client) management' },
      { name: 'configurations', description: 'Configuration item (asset) management' },
      { name: 'contacts', description: 'Contact management' },
      { name: 'passwords', description: 'Secure credential storage and retrieval' },
      { name: 'documents', description: 'Documentation management' },
      { name: 'flexible-assets', description: 'Custom structured documentation' },
      { name: 'api-patterns', description: 'IT Glue API patterns and best practices' }
    ],
    commands: [
      { name: '/lookup-asset', description: 'Find a configuration by name, hostname, serial, or IP' },
      { name: '/search-docs', description: 'Search documentation by keyword' },
      { name: '/get-password', description: 'Retrieve a password (with security logging)' },
      { name: '/find-organization', description: 'Find an organization by name' }
    ],
    apiInfo: {
      baseUrl: 'https://api.itglue.com',
      auth: 'API Key (ITG.xxx)',
      rateLimit: '3000 requests per 5 minutes',
      docsUrl: 'https://api.itglue.com/developer/'
    },
    path: 'kaseya/it-glue'
  },
  {
    id: 'syncro',
    name: 'Syncro MSP',
    vendor: 'Syncro',
    description: 'All-in-one PSA/RMM for ticket management, customer operations, assets, and invoicing.',
    category: 'psa',
    features: [
      'Ticket Management',
      'Customer Operations',
      'Asset Management',
      'Invoice Management'
    ],
    skills: [
      { name: 'tickets', description: 'Service ticket management, statuses, timers' },
      { name: 'customers', description: 'Customer and contact management' },
      { name: 'assets', description: 'Asset tracking and RMM integration' },
      { name: 'invoices', description: 'Invoice generation and payments' },
      { name: 'api-patterns', description: 'Syncro API authentication, pagination, rate limits' }
    ],
    commands: [
      { name: '/create-ticket', description: 'Create a new service ticket' },
      { name: '/search-tickets', description: 'Search for tickets by criteria' },
      { name: '/update-ticket', description: 'Update ticket fields (status, priority, assignee, due date)' },
      { name: '/add-ticket-comment', description: 'Add comments with visibility and email notification control' },
      { name: '/log-time', description: 'Log time entries with billable/non-billable options' },
      { name: '/get-customer', description: 'Retrieve customer details with optional assets/tickets' },
      { name: '/list-alerts', description: 'List RMM alerts with severity/status/customer filters' },
      { name: '/resolve-alert', description: 'Resolve alerts with optional ticket creation' },
      { name: '/search-assets', description: 'Search assets by name, serial, type, or customer' },
      { name: '/create-appointment', description: 'Create calendar appointments linked to tickets/customers' }
    ],
    apiInfo: {
      baseUrl: 'https://{subdomain}.syncromsp.com/api/v1',
      auth: 'API key as query parameter',
      rateLimit: '180 requests per minute',
      docsUrl: 'https://api-docs.syncromsp.com/'
    },
    path: 'syncro/syncro-msp'
  },
  {
    id: 'atera',
    name: 'Atera',
    vendor: 'Atera',
    description: 'Cloud-native RMM/PSA for tickets, agents, customers, alerts, and device monitoring.',
    category: 'psa',
    features: [
      'Ticket Management',
      'Agent Management',
      'Customer Operations',
      'Alert Management',
      'Device Monitoring'
    ],
    skills: [
      { name: 'tickets', description: 'Service ticket management with filters, statuses, comments' },
      { name: 'agents', description: 'RMM agent management and PowerShell execution' },
      { name: 'customers', description: 'Customer and contact management' },
      { name: 'alerts', description: 'Alert monitoring, acknowledgment, and resolution' },
      { name: 'devices', description: 'HTTP, SNMP, and TCP device monitors' },
      { name: 'api-patterns', description: 'X-API-KEY auth, OData pagination, rate limiting' }
    ],
    commands: [
      { name: '/create-ticket', description: 'Create a new service ticket' },
      { name: '/search-tickets', description: 'Search for tickets by criteria' },
      { name: '/update-ticket', description: 'Update ticket fields (status, priority, technician)' },
      { name: '/list-alerts', description: 'List active RMM alerts with filtering' },
      { name: '/resolve-alert', description: 'Resolve an RMM alert with optional ticket creation' },
      { name: '/run-powershell', description: 'Execute PowerShell script on an agent' },
      { name: '/search-customers', description: 'Search for customers by name or criteria' },
      { name: '/create-monitor', description: 'Create HTTP, TCP, or SNMP monitors' },
      { name: '/get-kb-articles', description: 'Search knowledge base articles' },
      { name: '/log-time', description: 'Log work hours on a ticket' }
    ],
    apiInfo: {
      baseUrl: 'https://app.atera.com/api/v3',
      auth: 'X-API-KEY header',
      rateLimit: '700 requests per minute',
      docsUrl: 'https://app.atera.com/apidocs/'
    },
    path: 'atera/atera'
  },
  {
    id: 'superops',
    name: 'SuperOps.ai',
    vendor: 'SuperOps',
    description: 'AI-powered PSA/RMM for tickets, assets, clients, alerts, and runbook automation.',
    category: 'psa',
    features: [
      'Ticket Management',
      'Asset Management',
      'Client Operations',
      'Alert Handling',
      'Runbook Execution'
    ],
    skills: [
      { name: 'tickets', description: 'Service ticket management and workflows' },
      { name: 'assets', description: 'Asset inventory and management' },
      { name: 'clients', description: 'Client and site management' },
      { name: 'alerts', description: 'Alert monitoring and resolution' },
      { name: 'runbooks', description: 'Script and runbook execution' },
      { name: 'api-patterns', description: 'Common SuperOps.ai GraphQL patterns' }
    ],
    commands: [
      { name: '/create-ticket', description: 'Create a new service ticket' },
      { name: '/search-tickets', description: 'Search for tickets by criteria' },
      { name: '/update-ticket', description: 'Update ticket fields (status, priority, technician)' },
      { name: '/add-ticket-note', description: 'Add internal or public notes to tickets' },
      { name: '/log-time', description: 'Log time entries against tickets for billing' },
      { name: '/list-alerts', description: 'List active RMM alerts with filtering' },
      { name: '/acknowledge-alert', description: 'Acknowledge alerts to indicate investigation started' },
      { name: '/resolve-alert', description: 'Resolve alerts with optional ticket creation' },
      { name: '/run-script', description: 'Execute scripts on remote assets' },
      { name: '/get-asset', description: 'Retrieve detailed asset information' }
    ],
    apiInfo: {
      baseUrl: 'https://api.superops.ai/graphql',
      auth: 'Bearer token + CustomerSubDomain header',
      rateLimit: '800 requests per minute',
      docsUrl: 'https://developer.superops.ai/'
    },
    path: 'superops/superops-ai'
  },
  {
    id: 'halopsa',
    name: 'HaloPSA',
    vendor: 'Halo',
    description: 'Modern PSA for ticket management, client operations, asset tracking, and contracts.',
    category: 'psa',
    features: [
      'Ticket Management',
      'Client Operations',
      'Asset Tracking',
      'Contract Management'
    ],
    skills: [
      { name: 'tickets', description: 'Ticket management, actions, and attachments' },
      { name: 'clients', description: 'Client CRUD, sites, and contacts' },
      { name: 'assets', description: 'Asset tracking and device management' },
      { name: 'contracts', description: 'Contract management and billing' },
      { name: 'api-patterns', description: 'OAuth 2.0 authentication, pagination, rate limiting' }
    ],
    commands: [
      { name: '/create-ticket', description: 'Create a new service ticket' },
      { name: '/search-tickets', description: 'Search for tickets by criteria' },
      { name: '/add-action', description: 'Add actions (notes, updates, phone calls) to tickets' },
      { name: '/update-ticket', description: 'Update ticket fields (status, priority, category, team, agent)' },
      { name: '/show-ticket', description: 'Display comprehensive ticket information' },
      { name: '/sla-dashboard', description: 'View SLA status across tickets (breaching, at-risk, on-track)' },
      { name: '/search-clients', description: 'Search clients by name, domain, or attributes' },
      { name: '/search-assets', description: 'Search assets by name, serial, type, or client' },
      { name: '/kb-search', description: 'Search the knowledge base for articles and solutions' },
      { name: '/contract-status', description: 'Check contract status and service entitlements' }
    ],
    apiInfo: {
      baseUrl: 'https://{tenant}.halopsa.com/api',
      auth: 'OAuth 2.0 Client Credentials',
      rateLimit: '500 requests per 3 minutes',
      docsUrl: 'https://halopsa.com/apidocs/'
    },
    path: 'halopsa/halopsa'
  },
  {
    id: 'connectwise-psa',
    name: 'ConnectWise PSA',
    vendor: 'ConnectWise',
    description: 'Industry-leading PSA for tickets, companies, contacts, projects, and time tracking.',
    category: 'psa',
    features: [
      'Ticket Management',
      'Company Management',
      'Contact Management',
      'Project Management',
      'Time Entry Tracking'
    ],
    skills: [
      { name: 'tickets', description: 'Service ticket management, statuses, priorities, boards' },
      { name: 'companies', description: 'Company CRUD, types, sites, custom fields' },
      { name: 'contacts', description: 'Contact management, communication items, portal access' },
      { name: 'projects', description: 'Project CRUD, phases, templates, resource allocation' },
      { name: 'time-entries', description: 'Time entry CRUD, billable/non-billable, work types' },
      { name: 'api-patterns', description: 'Authentication, pagination, conditions syntax' }
    ],
    commands: [
      { name: '/create-ticket', description: 'Create a new service ticket with company lookup' },
      { name: '/search-tickets', description: 'Search tickets with filters' },
      { name: '/get-ticket', description: 'Retrieve detailed ticket information' },
      { name: '/update-ticket', description: 'Update ticket fields (status, priority, board)' },
      { name: '/add-note', description: 'Add internal or discussion note to ticket' },
      { name: '/close-ticket', description: 'Close tickets with resolution notes' },
      { name: '/log-time', description: 'Log time entry against ticket' },
      { name: '/lookup-config', description: 'Search configuration items/assets' },
      { name: '/check-agreement', description: 'View agreement status and entitlements' },
      { name: '/schedule-entry', description: 'Create schedule entry/appointment' }
    ],
    apiInfo: {
      baseUrl: 'https://api-na.myconnectwise.net/{codebase}/apis/3.0/',
      auth: 'Basic Auth (companyId+publicKey:privateKey) + clientId',
      rateLimit: '60 requests per minute',
      docsUrl: 'https://developer.connectwise.com/Products/ConnectWise_PSA'
    },
    path: 'connectwise/manage'
  },
  {
    id: 'connectwise-automate',
    name: 'ConnectWise Automate',
    vendor: 'ConnectWise',
    description: 'Enterprise RMM for computer management, scripts, monitors, alerts, and client management.',
    category: 'rmm',
    features: [
      'Computer Management',
      'Script Execution',
      'Monitor Configuration',
      'Alert Handling',
      'Client Management'
    ],
    skills: [
      { name: 'computers', description: 'Computer listing, status monitoring, inventory, patches' },
      { name: 'clients', description: 'Client CRUD operations, locations, settings, groups' },
      { name: 'scripts', description: 'Script listing, execution, parameters, results' },
      { name: 'monitors', description: 'Monitor types, thresholds, templates, assignments' },
      { name: 'alerts', description: 'Alert listing, acknowledgment, history, ticket creation' },
      { name: 'api-patterns', description: 'Authentication, pagination, filtering, error handling' }
    ],
    commands: [
      { name: '/list-computers', description: 'List computers with filters' },
      { name: '/run-script', description: 'Execute a script on an endpoint with parameters' }
    ],
    apiInfo: {
      baseUrl: 'https://{server}/cwa/api/v1/',
      auth: 'Token-based (Integrator or User credentials)',
      rateLimit: '60 requests per minute',
      docsUrl: 'https://developer.connectwise.com/Products/ConnectWise_Automate'
    },
    path: 'connectwise/automate'
  }
];

export function getPluginById(id: string): Plugin | undefined {
  return plugins.find(p => p.id === id);
}

export function getPluginsByCategory(category: 'psa' | 'rmm' | 'documentation'): Plugin[] {
  return plugins.filter(p => p.category === category);
}

export function getPluginsByVendor(vendor: string): Plugin[] {
  return plugins.filter(p => p.vendor.toLowerCase() === vendor.toLowerCase());
}
