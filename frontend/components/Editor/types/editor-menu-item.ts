export interface EditorMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  // TODO: Fix this
  // icon: typeof BoldIcon;
  icon: any;
}
