import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/core/tabs"

export function TabsExample() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="text-sm text-muted-foreground">Project summary and recent activity.</p>
      </TabsContent>
      <TabsContent value="usage">
        <p className="text-sm text-muted-foreground">Compute and storage usage this period.</p>
      </TabsContent>
      <TabsContent value="billing">
        <p className="text-sm text-muted-foreground">Plan, invoices, and payment method.</p>
      </TabsContent>
    </Tabs>
  )
}
