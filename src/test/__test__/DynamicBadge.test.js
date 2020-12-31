import React from 'react'
import renderer from 'react-test-renderer'
import shallow from 'react-test-renderer/shallow'

import DynamicBadge from './../../DynamicBadge.js'

// Testing with the following items

const items = []

for (let i = 0; i < 10; i++) {
  items.push('Item ' + i)
}

beforeEach(() => {
  // Have to mock getComputedStyle() to make it work in tests
  Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({
      paddingRight: 0,
      paddingLeft: 0,
      fontSize: 10
    })
  })
})

describe('<DynamicBadge>', () => {
  test('match shallow snapshot', () => {
    const renderer = new shallow()

    renderer.render(<DynamicBadge items={items} testRulerSpanWidth={100} />)

    const result = renderer.getRenderOutput()

    expect(result).toMatchSnapshot()
  })

  test('match snapshot', () => {
    // Define a mock for the parent element
    const parentNode = { clientWidth: 400 }

    const component = renderer.create(
      <DynamicBadge items={items} testRulerSpanWidth={100} />,

      {
        // This mock is needed for the refContainer
        createNodeMock: (element) => {
          if (element.type === 'div') {
            // mock parent element
            return {
              // Pass the previously created mock parentNode
              parentNode: parentNode
            }
          }
          return null
        }
      }
    )

    expect(component.toJSON()).toMatchSnapshot()
  })

  for (let i = 0; i < items.length + 1; i++) {
    const message =
      i === items.length
        ? 'renders ' + i + ' items and no badge'
        : 'renders ' + i + ' items and a badge with value ' + (items.length - i)

    let component = null

    test(message, () => {
      // Define a mock for the parent element, make it small (1px)
      const parentNode = {
        clientWidth: 100 * i
      }

      const rulerWidth = items.length * 100

      component = renderer.create(
        <DynamicBadge items={items} testRulerSpanWidth={rulerWidth} minWidth={10} />,

        {
          // This mock is needed for the refContainer
          createNodeMock: (element) => {
            if (element.type === 'div') {
              // mock parent element
              return {
                // Pass the previously created mock parentNode
                parentNode: parentNode
              }
            }
            return null
          }
        }
      )

      // Get the instance of the component
      const testInstance = component.root

      if (i < items.length) {
        // Expect the badge to be visible and to contain the number of the items
        expect(testInstance.findByProps({ className: 'bdg-badge' }).children).toEqual([
          (items.length - i).toString()
        ])
      } else {
        // No badge has to be visible
        expect(() => testInstance.findByProps({ className: 'bdg-badge' })).toThrowError(
          /No instances found/
        )
      }
    })
  }

  test('renders only one item', () => {
    // Define a mock for the parent element
    const parentNode = { clientWidth: 400 }

    const component = renderer.create(
      <DynamicBadge items={['Item 1']} />,

      {
        // This mock is needed for the refContainer
        createNodeMock: (element) => {
          if (element.type === 'div') {
            // mock parent element
            return {
              // Pass the previously created mock parentNode
              parentNode: parentNode
            }
          }
          return null
        }
      }
    )

    const testInstance = component.root
    expect(testInstance.findByProps({ className: 'bdg-ellipsis' }).children).toEqual(['Item 1'])
    expect(() => testInstance.findByProps({ className: 'bdg-badge' })).toThrowError(
      /No instances found/
    )
  })

  test('renders only one item in a zero width container, hence showing a badge with value 1', () => {
    // Define a mock for the parent element
    const parentNode = { clientWidth: 0 }

    const component = renderer.create(
      <DynamicBadge items={['Item 1']} testRulerSpanWidth={100} minWidth={10} />,

      {
        // This mock is needed for the refContainer
        createNodeMock: (element) => {
          if (element.type === 'div') {
            // mock parent element
            return {
              // Pass the previously created mock parentNode
              parentNode: parentNode
            }
          }
          return null
        }
      }
    )

    const testInstance = component.root
    expect(testInstance.findByProps({ className: 'bdg-badge' }).children).toEqual(['1'])
  })

  test('renders only the badge', () => {
    // Define a mock for the parent element
    const parentNode = { clientWidth: 400 }

    const component = renderer.create(
      <DynamicBadge items={items} onlyBadge={true} />,

      {
        // This mock is needed for the refContainer
        createNodeMock: (element) => {
          if (element.type === 'div') {
            // mock parent element
            return {
              // Pass the previously created mock parentNode
              parentNode: parentNode
            }
          }
          return null
        }
      }
    )

    const testInstance = component.root
    expect(testInstance.findByProps({ className: 'bdg-badge' }).children).toEqual([
      items.length.toString()
    ])
  })

  test('renders a badge with a custom class', () => {
    // Define a mock for the parent element
    const parentNode = { clientWidth: 400 }

    const component = renderer.create(
      <DynamicBadge items={items} onlyBadge={true} badgeClass="test-badge-class" />,

      {
        // This mock is needed for the refContainer
        createNodeMock: (element) => {
          if (element.type === 'div') {
            // mock parent element
            return {
              // Pass the previously created mock parentNode
              parentNode: parentNode
            }
          }
          return null
        }
      }
    )

    const testInstance = component.root
    expect(testInstance.findByProps({ className: 'test-badge-class' }).children).toEqual([
      items.length.toString()
    ])
  })
})
