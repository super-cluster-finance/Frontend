import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetList } from "@/components/app/Lists";
import { Bitcoin } from "lucide-react";

export function CardDemo() {
  const items = [
    { icon: <Bitcoin />, name: "Bitcoin", duration: "49Days", apy: "96.65%" },
    { icon: <Bitcoin />, name: "Bitcoin", duration: "49Days", apy: "96.65%" },
  ];
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>StablecoinTop Fixed APY</CardTitle>
      </CardHeader>
      <CardContent>
        <AssetList items={items} />
      </CardContent>
    </Card>
  );
}
