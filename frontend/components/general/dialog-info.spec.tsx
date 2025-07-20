import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import DialogInfo from './dialog-info'

describe('DialogBanner', () => {
  it('should render the dialog banner', () => {
    render(<DialogInfo open={true} message="Test message" onClose={() => {}} />)
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('should not render the dialog banner when open is false', () => {
    render(<DialogInfo open={false} message="Test message" onClose={() => {}} />)
    expect(screen.queryByText('Test message')).not.toBeInTheDocument()
  })

  it('should call onClose when the close button is clicked', () => {
    const onClose = jest.fn()
    render(<DialogInfo open={true} message="Test message" onClose={onClose} />)
    screen.getByRole('button', { name: 'OK' }).click()
    expect(onClose).toHaveBeenCalled()
  })
})