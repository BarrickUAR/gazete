import { DesignSwitcher } from "@/components/design-switcher";

export default function TasarimLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <DesignSwitcher />
    </>
  );
}
