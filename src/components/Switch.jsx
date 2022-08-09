import Switch from 'react-switch'

function SwitchComponent({
  checked,
  setChecked,
  uncheckedOption,
  checkedOption
}) {
  return (
    <div className='switch flex'>
      <p className='option'>{uncheckedOption}</p>
      <Switch
        onChange={() => setChecked(!checked)}
        checked={checked}
        uncheckedIcon={false}
        checkedIcon={false}
        height={20}
        width={40}
        onColor='#008ACF'
      />
      <p className='option'>{checkedOption}</p>
    </div>
  )
}

export default SwitchComponent
