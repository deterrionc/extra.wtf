interface FaIconProps {
  iconName: string
}

export const FaIcon = ({ iconName }: FaIconProps) => {
  const _iconName = "fa " + iconName
  return (
    <i className={_iconName} />
  )
}