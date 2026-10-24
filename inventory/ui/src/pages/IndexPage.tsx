import { useQuery } from "@apollo/client";
import type { ComponentType, ReactNode } from "react";
import {
  IconBook,
  IconDatabase,
  IconExternalLink,
  IconLayoutDashboard,
  IconSandbox,
  IconSettings,
} from "@tabler/icons-react";
// Root imports on purpose: core-ui shares `erxes-ui`/`ui-modules` as Module
// Federation singletons keyed on the bare specifier, so deep imports would
// bundle second private copies instead of reusing the host's.
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Separator,
  Skeleton,
  cn,
} from "erxes-ui";
import { PageHeader } from "ui-modules";
import { Link } from "react-router";
import manifest from "../../../erxes.json" with { type: "json" };
import { STATUS_QUERY } from "../graphql";
import { Samples } from "../Samples";

const { path } = manifest.ui;

const Dot = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "inventory:inline-block inventory:size-2 inventory:rounded-full",
      className,
    )}
  />
);

const StatusRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="inventory:flex inventory:items-center inventory:justify-between inventory:gap-4 inventory:text-sm">
    <span className="inventory:text-muted-foreground">{label}</span>
    <span className="inventory:flex inventory:items-center inventory:gap-2 inventory:font-medium">
      {children}
    </span>
  </div>
);

const ConnectionCard = () => {
  const { data, loading, error, refetch } = useQuery(STATUS_QUERY);
  const status = data?.inventoryStatus;

  const pending = (
    <>
      <Dot className="inventory:animate-pulse inventory:bg-muted-foreground" />
      <Skeleton className="inventory:h-4 inventory:w-24" />
    </>
  );

  return (
    <Card className="inventory:w-full inventory:md:w-80 inventory:shrink-0">
      <Card.Header>
        <Card.Title className="inventory:text-sm">Connection</Card.Title>
        <Card.Description>
          Live status of this plugin inside erxes
        </Card.Description>
      </Card.Header>
      <Card.Content className="inventory:flex inventory:flex-col inventory:gap-3">
        <StatusRow label="API">
          {loading ? (
            pending
          ) : error ? (
            <>
              <Dot className="inventory:bg-destructive" />
              <span>Unreachable</span>
              <Button variant="ghost" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </>
          ) : (
            <>
              <Dot className="inventory:bg-success" />
              <span>Connected · v{status?.version}</span>
            </>
          )}
        </StatusRow>
        <StatusRow label="Gateway">
          {loading ? (
            pending
          ) : error ? (
            <>
              <Dot className="inventory:bg-destructive" />
              <span
                className="inventory:truncate inventory:max-w-40"
                title={error.message}
              >
                {error.message}
              </span>
            </>
          ) : (
            <>
              <Dot className="inventory:bg-success" />
              <span>Federated as {status?.plugin}</span>
            </>
          )}
        </StatusRow>
        <StatusRow label="Tenant">
          {loading ? pending : (status?.subdomain ?? "—")}
        </StatusRow>
        <StatusRow label="Signed in">
          {loading
            ? pending
            : (status && (status.userEmail ?? status.userId ?? "Anonymous")) ||
              "—"}
        </StatusRow>
      </Card.Content>
    </Card>
  );
};

const StepCard = ({
  icon: Icon,
  title,
  description,
  code,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  code: string;
}) => (
  <Card>
    <Card.Header>
      <div className="inventory:flex inventory:size-9 inventory:items-center inventory:justify-center inventory:rounded-lg inventory:bg-accent">
        <Icon className="inventory:size-5" />
      </div>
      <Card.Title>{title}</Card.Title>
      <Card.Description>{description}</Card.Description>
    </Card.Header>
    <Card.Content>
      <code className="inventory:rounded inventory:bg-muted inventory:px-1.5 inventory:py-0.5 inventory:font-mono inventory:text-xs">
        {code}
      </code>
    </Card.Content>
  </Card>
);

const STEPS = [
  {
    icon: IconDatabase,
    title: "Model your data",
    description:
      "Define the records this plugin owns and expose them on the federated graph.",
    code: "api/src/modules/sample",
  },
  {
    icon: IconLayoutDashboard,
    title: "Build the page",
    description:
      "Replace this overview with your module: lists with RecordTable, forms with Form, details in a Sheet.",
    code: "ui/src/pages/IndexPage.tsx",
  },
];

export const IndexPage = () => (
  <div className="inventory:flex inventory:h-full inventory:flex-col">
    <PageHeader>
      <PageHeader.Start>
        <Breadcrumb>
          <Breadcrumb.List className="inventory:gap-1">
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to={`/${path}`}>
                  <IconSandbox />
                  {manifest.title}
                </Link>
              </Button>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
        <Separator.Inline />
        <PageHeader.FavoriteToggleButton
          breadcrumb={[manifest.title]}
          icon="IconSandbox"
        />
      </PageHeader.Start>
      <PageHeader.End>
        <Button variant="outline" asChild>
          <Link to={`/${path}/settings`}>
            <IconSettings />
            Settings
          </Link>
        </Button>
      </PageHeader.End>
    </PageHeader>
    <div className="inventory:flex-1 inventory:overflow-auto">
      <div className="inventory:mx-auto inventory:flex inventory:w-full inventory:max-w-5xl inventory:flex-col inventory:gap-6 inventory:p-6">
        <section className="inventory:relative inventory:overflow-hidden inventory:rounded-xl inventory:border inventory:border-border inventory:bg-background inventory:p-8 inventory:shadow-xs">
          <div
            aria-hidden
            className="inventory:pointer-events-none inventory:absolute inventory:inset-0 inventory:bg-gradient-to-br inventory:from-primary/10 inventory:via-transparent inventory:to-transparent"
          />
          <div className="inventory:relative inventory:flex inventory:flex-col inventory:gap-6 inventory:md:flex-row inventory:md:items-start inventory:md:justify-between">
            <div className="inventory:flex inventory:max-w-xl inventory:flex-col inventory:gap-4">
              <div>
                <Badge variant="info">Plugin · v{manifest.version}</Badge>
              </div>
              <h1 className="inventory:text-2xl inventory:font-semibold inventory:tracking-tight">
                Welcome to {manifest.title}
              </h1>
              <p className="inventory:text-sm inventory:leading-relaxed inventory:text-muted-foreground">
                {manifest.description}
              </p>
              <div className="inventory:flex inventory:flex-wrap inventory:gap-2">
                <Button asChild>
                  <Link to={`/${path}/settings`}>
                    <IconSettings />
                    Open settings
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href="https://erxes.io/docs/create-plugin-standalone"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconBook />
                    Developer guide
                    <IconExternalLink />
                  </a>
                </Button>
              </div>
            </div>
            <ConnectionCard />
          </div>
        </section>
        <Samples />
        <div className="inventory:grid inventory:gap-4 inventory:md:grid-cols-2">
          {STEPS.map((step) => (
            <StepCard key={step.title} {...step} />
          ))}
        </div>
      </div>
    </div>
  </div>
);
