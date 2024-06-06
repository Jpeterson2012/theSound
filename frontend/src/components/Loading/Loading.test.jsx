import { render, screen } from '@testing-library/react'
import Loading from './Loading'
import { expect, test } from 'vitest'

describe('Logo', () => {
    it('renders the Logo component', () => {
      render(<Loading yes={false}/>)
      
      screen.debug(); // prints out the jsx in the App component unto the command line
    })
  })

test("Loading text renders", () => {
    render(<Loading yes={true} />)
    expect(screen.getByText(/Preparing your experience.../i)).toBeInTheDocument()
})