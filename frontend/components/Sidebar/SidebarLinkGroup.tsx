import { ReactNode, useState } from 'react';

interface SidebarLinkGroupProps {
  children: (handleClick: () => void, open: boolean) => ReactNode;
  activeCondition: boolean;
  hidden?: boolean;
}

const SidebarLinkGroup = ({
  children,
  activeCondition,
  hidden,
}: SidebarLinkGroupProps) => {
  const [open, setOpen] = useState<boolean>(activeCondition);

  const handleClick = () => {
    setOpen(!open);
  };

  if (hidden) {
    return null;
  }

  return <li>{children(handleClick, open)}</li>;
};

export default SidebarLinkGroup;
