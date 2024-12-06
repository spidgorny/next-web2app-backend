import { Card, CardBody } from "@nextui-org/react";

export function ErrorAlert(props: { error?: Error | null }) {
  if (!props.error) {
    return;
  }
  return (
    <Card>
      <CardBody className="text-red-500">
        <p>
          {props.error.message} [{props.error.name}]
        </p>
      </CardBody>
    </Card>
  );
}
