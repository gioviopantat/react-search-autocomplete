import { MouseEvent, ReactNode } from 'react'
import styled from 'styled-components'

export type Item<T> = T & { [key: string]: any }

export interface ResultsProps<T> {
  results: Item<T>[]
  onClick: Function
  highlightedItem: number
  setHighlightedItem: Function
  setSearchString: Function
  formatResult?: Function
  maxResults: number
  resultStringKeyName: string
  showNoResultsFlag?: boolean
  showNoResultsText?: string
}

export default function Results<T>({
  results = [] as any,
  onClick,
  setSearchString,
  maxResults,
  resultStringKeyName = 'name',
  highlightedItem,
  setHighlightedItem,
  formatResult,
  showNoResultsFlag = true,
  showNoResultsText = 'No results'
}: ResultsProps<T>) {
  type WithStringKeyName = T & Record<string, unknown>

  const formatResultWithKey = formatResult
    ? formatResult
    : (item: WithStringKeyName) => item[resultStringKeyName]

  const handleClick = (result: WithStringKeyName) => {
    onClick(result)
    setSearchString(result[resultStringKeyName])
  }

  const handleMouseDown = ({
    event,
    result
  }: {
    event: MouseEvent<HTMLLIElement>
    result: WithStringKeyName
  }) => {
    if (event.button === 0) {
      event.preventDefault()
      handleClick(result)
    }
  }

  if (showNoResultsFlag) {
    return (
      <ResultsWrapper>
        <li data-test="no-results-message">
          <div className="ellipsis">{showNoResultsText}</div>
        </li>
      </ResultsWrapper>
    )
  }

  if (results?.length <= 0 && !showNoResultsFlag) {
    return null
  }

  return (
    <ResultsWrapper>
      {results.slice(0, maxResults).map((result, index) => (
        <li
          className={highlightedItem === index ? 'selected' : ''}
          onMouseEnter={() => setHighlightedItem({ index })}
          data-test="result"
          key={`rsa-result-${result.id}`}
          onMouseDown={(event) => handleMouseDown({ event, result })}
          onClick={() => handleClick(result)}
        >
          <div className="ellipsis" title={result[resultStringKeyName] as string}>
            {formatResultWithKey(result)}
          </div>
        </li>
      ))}
    </ResultsWrapper>
  )
}

const ResultsWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <StyledResults>
      <div className="line" />
      <ul>{children}</ul>
    </StyledResults>
  )
}

const StyledResults = styled.div`
  > div.line {
    border-top-color: #d9d9d9;
    border-top-style: solid;
    border-top-width: 1px;

    margin-bottom: 0px;
    margin-left: 14px;
    margin-right: 20px;
    margin-top: 0px;

    padding-bottom: 4px;
  }

  > ul {
    list-style-type: none;
    margin: 0;
    padding: 8px 4px 8px 4px;
    max-height: ${(props) => props.theme.maxHeight};

    > li {
      display: flex;
      align-items: center;
      padding: 4px;
    }
  }

  .ellipsis {
    margin: 0;
    text-align: left;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .selected {
    background-color: ${(props) => props.theme.hoverBackgroundColor};
    border-radius: 10px;
  }
`
