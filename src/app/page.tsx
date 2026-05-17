import { getCatalog } from "@/lib/catalog";
import OrderForm from "@/components/OrderForm";

export default async function Home() {
  const catalog = await getCatalog();
  return <OrderForm catalog={catalog} />;
}
