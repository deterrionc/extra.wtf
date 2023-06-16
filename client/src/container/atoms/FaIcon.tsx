interface FaIconProps {
  iconName: string
  className?: string
}

export const FaIcon = ({ iconName, className }: FaIconProps) => {
  const _iconName = "fa " + iconName + " " + className
  return (
    <i className={_iconName} />
  )
}