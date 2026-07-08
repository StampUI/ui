import { Card, CardHeader, CardTitle, CardBody, CardFooter } from "@/components/core/card"
import { Button } from "@/components/core/button"

export function CardExample() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Upgrade to Pro</CardTitle>
        <p className="text-sm text-muted-foreground">
          Unlock the full component catalog and priority support.
        </p>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-muted-foreground">
          $19/month, billed annually. Cancel anytime.
        </p>
      </CardBody>
      <CardFooter>
        <Button className="w-full">Upgrade</Button>
      </CardFooter>
    </Card>
  )
}
