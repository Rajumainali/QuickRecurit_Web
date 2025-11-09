import { Button } from "../../components/ui/button";
interface ButtonDemoProps {
  name: string;
  className?: string;
}

export function ButtonDemo({ name, className }: ButtonDemoProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button className={className}>{name}</Button>
    </div>
  );
}
