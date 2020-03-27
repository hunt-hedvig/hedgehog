import { Button } from 'hedvig-ui/button'
import { MainHeadline, SecondLevelHeadline } from 'hedvig-ui/typography'
import * as React from 'react'
import ReactDropZone from 'react-dropzone'
import styled from 'react-emotion'
import { Dropdown, Form, TextArea } from 'semantic-ui-react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { withShowNotification } from 'utils/notifications'
import { OnBlurChangeInput } from './inputs'

const Wrapper = styled(Form)``

const perilIconOptions = [
  {
    key: 'Fire',
    text: 'fire',
    value: 'Fire',
    image: {
      avatar: true,
      src: 'https://graphql.dev.hedvigit.com/app-content-service/fire.svg',
    },
  },
  {
    key: 'Water leaks',
    text: 'water_damage',
    value: 'Water_damage',
    image: {
      avatar: true,
      src:
        'https://graphql.dev.hedvigit.com/app-content-service/water_damage.svg',
    },
  },
  {
    key: 'Burglary',
    text: 'burglary',
    value: 'burglary',
    image: {
      avatar: true,
      src: 'https://graphql.dev.hedvigit.com/app-content-service/burglary.svg',
    },
  },
  {
    key: 'Theft and damage',
    text: 'theft',
    value: 'theft',
    image: {
      avatar: true,
      src: 'https://graphql.dev.hedvigit.com/app-content-service/theft.svg',
    },
  },
  {
    key: 'Criminal damage',
    text: 'criminal_damage',
    value: 'criminal_damage',
    image: {
      avatar: true,
      src:
        'https://graphql.dev.hedvigit.com/app-content-service/criminal_damage.svg',
    },
  },
  {
    key: 'Liability protection',
    text: 'liability',
    value: 'liability',
    image: {
      avatar: true,
      src: 'https://graphql.dev.hedvigit.com/app-content-service/liability.svg',
    },
  },
  {
    key: 'Legal protection',
    text: 'legal_protection',
    value: 'legal_protection',
    image: {
      avatar: true,
      src:
        'https://graphql.dev.hedvigit.com/app-content-service/legal_protection.svg',
    },
  },
  {
    key: 'Travel insurance',
    text: 'travel_insurance',
    value: 'travel_insurance',
    image: {
      avatar: true,
      src:
        'https://graphql.dev.hedvigit.com/app-content-service/travel_insurance.svg',
    },
  },
  {
    key: 'Assault',
    text: 'assault',
    value: 'assault',
    image: {
      avatar: true,
      src: 'https://graphql.dev.hedvigit.com/app-content-service/assault.svg',
    },
  },
  {
    key: 'Travel illness',
    text: 'sick_on_holiday',
    value: 'sick_on_holiday',
    image: {
      avatar: true,
      src:
        'https://graphql.dev.hedvigit.com/app-content-service/sick_on_holiday.svg',
    },
  },
  {
    key: 'White goods',
    text: 'appliance_damage',
    value: 'appliance_damage',
    image: {
      avatar: true,
      src:
        'https://graphql.dev.hedvigit.com/app-content-service/appliance_damage.svg',
    },
  },
  {
    key: 'All-risk',
    text: 'all_risk',
    value: 'all_risk',
    image: {
      avatar: true,
      src: 'https://graphql.dev.hedvigit.com/app-content-service/all_risk.svg',
    },
  },
  {
    key: 'Tenant ownership',
    text: 'apartment_add_on',
    value: 'apartment_add_on',
    image: {
      avatar: true,
      src:
        'https://graphql.dev.hedvigit.com/app-content-service/apartment_add_on.svg',
    },
  },
  {
    key: 'Storms',
    text: 'nature_damage',
    value: 'nature_damage',
    image: {
      avatar: true,
      src:
        'https://graphql.dev.hedvigit.com/app-content-service/nature_damage.svg',
    },
  },
  {
    key: 'Pests',
    text: 'pest_sanitation',
    value: 'pest_sanitation',
    image: {
      avatar: true,
      src:
        'https://graphql.dev.hedvigit.com/app-content-service/pest_sanitation.svg',
    },
  },
  {
    key: 'Rebuilding',
    text: 'renovation',
    value: 'renovation',
    image: {
      avatar: true,
      src:
        'https://graphql.dev.hedvigit.com/app-content-service/renovation.svg',
    },
  },
  {
    key: 'Cancellation coverage',
    text: 'cancellation_coverage',
    value: 'cancellation_coverage',
    image: {
      avatar: true,
      src:
        'https://graphql.dev.hedvigit.com/app-content-service/cancellation_coverage.svg',
    },
  },
  {
    key: 'Damaged luggage',
    text: 'damaged_luggage',
    value: 'damaged_luggage',
    image: {
      avatar: true,
      src:
        'https://graphql.dev.hedvigit.com/app-content-service/damaged_luggage.svg',
    },
  },
  {
    key: 'Delayed luggage',
    text: 'delayed_luggage',
    value: 'delayed_luggage',
    image: {
      avatar: true,
      src:
        'https://graphql.dev.hedvigit.com/app-content-service/delayed_luggage.svg',
    },
  },
  {
    key: 'Personal accident',
    text: 'personal_accident',
    value: 'personal_accident',
    image: {
      avatar: true,
      src:
        'https://graphql.dev.hedvigit.com/app-content-service/personal_accident.svg',
    },
  },
  {
    key: 'Replacement housing',
    text: 'replacement_housing',
    value: 'replacement_housing',
    image: {
      avatar: true,
      src:
        'https://graphql.dev.hedvigit.com/app-content-service/replacement_housing.svg',
    },
  },
  {
    key: 'Apartment adaption',
    text: 'apartment_adaption',
    value: 'apartment_adaption',
    image: {
      avatar: true,
      src:
        'https://graphql.dev.hedvigit.com/app-content-service/apartment_adaption.svg',
    },
  },
]

const PerilEditWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: #fff;
  margin-bottom: 1rem;
`

const CoverageWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const CoverageItemWrapper = styled.div`
  display: flex;
`

const Coverage = styled.div`
  width: 50%;
  padding: 1rem;

  ${CoverageItemWrapper}, .input {
    width: 100%;
  }
`

const PERIL_CONTENTS_KEY = '_hvg:peril-contents'
const PERIL_FILE_KEY = '_hvg:peril-file-name'

interface Peril {
  title: string | { props: { children: string } }
  description: string
  covered: string[]
  exceptions: string[]
  info: string
  icon: string
}

export const PerilsEditorComponent: React.FC<WithShowNotification> = ({
  showNotification,
}) => {
  const [fileName, setFileName] = React.useState(() =>
    localStorage.getItem(PERIL_FILE_KEY),
  )
  const [contents, setContents] = React.useState(() =>
    localStorage.getItem(PERIL_CONTENTS_KEY),
  )
  const [parsedPerils, reallySetParsedPerils] = React.useState<ReadonlyArray<
    Peril
  > | null>(null)
  const setParsedPerils = (perils: ReadonlyArray<Peril>) => {
    reallySetParsedPerils(perils)
    localStorage.setItem(PERIL_CONTENTS_KEY, JSON.stringify(perils))
  }

  React.useEffect(() => {
    if (!contents) {
      return
    }

    setParsedPerils(JSON.parse(contents))
  }, [contents])

  const handleFileUpload = ([file]: File[]) => {
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target!.result as string

      if (!isValidJson(result)) {
        showNotification({
          message: 'Unable to parse this file',
          type: 'red',
          header: 'Invalid file',
        })
        return
      }

      setContents(result)
      localStorage.setItem(PERIL_CONTENTS_KEY, result)
      setFileName(file.name)
      localStorage.setItem(PERIL_FILE_KEY, file.name)
    }
    reader.readAsText(file)
  }

  return (
    <>
      <MainHeadline>📝 Perils editor</MainHeadline>
      <ReactDropZone onDrop={handleFileUpload} accept={['application/json']}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <Button {...getRootProps()} css={undefined}>
            <input {...getInputProps()} />
            {isDragActive ? 'Drag file to edit' : 'Select file to edit'}
          </Button>
        )}
      </ReactDropZone>

      <SecondLevelHeadline>
        Edit <code>{fileName}</code>
        <a
          href={`data:application/json;charset=utf8,${encodeURIComponent(
            JSON.stringify(parsedPerils, null, 2),
          )}`}
          download={fileName}
        >
          Download file
        </a>
      </SecondLevelHeadline>
      <Wrapper>
        {parsedPerils &&
          parsedPerils.map((peril, index) => {
            const actualTitle =
              typeof peril.title === 'string'
                ? peril.title
                : peril.title.props.children
            const updateField = (field: string) => (value: any) => {
              setParsedPerils(
                parsedPerils.map((originalPeril, i_) => {
                  if (i_ === index) {
                    return { ...originalPeril, [field]: value }
                  }
                  return originalPeril
                }),
              )
            }

            return (
              <PerilEditWrapper key={actualTitle}>
                <OnBlurChangeInput
                  originalValue={actualTitle}
                  onUpdate={(newTitle) => {
                    updateField('title')(newTitle)
                  }}
                  size="big"
                />

                <TextArea
                  value={peril.description}
                  onChange={(_, data) => {
                    updateField('description')(data.value)
                  }}
                />

                <CoverageWrapper>
                  <Coverage>
                    Covered
                    {peril.covered.map((coveredText, coveredIndex) => (
                      <CoverageItemWrapper key={coveredText}>
                        <OnBlurChangeInput
                          originalValue={coveredText}
                          onUpdate={(newCoveredText) => {
                            updateField('covered')(
                              peril.covered.map((original, i_) => {
                                if (i_ === coveredIndex) {
                                  return newCoveredText
                                }
                                return original
                              }),
                            )
                          }}
                        />
                        <Button
                          variation="danger"
                          onClick={() => {
                            updateField('covered')(
                              peril.covered.filter(
                                (_, i) => i !== coveredIndex,
                              ),
                            )
                          }}
                        >
                          &times;
                        </Button>
                      </CoverageItemWrapper>
                    ))}
                    <Button
                      variation="success"
                      type="button"
                      onClick={() => {
                        updateField('covered')(peril.covered.concat(['']))
                      }}
                    >
                      + Add coverage
                    </Button>
                  </Coverage>
                  <Coverage>
                    Exceptions
                    {peril.exceptions.map((exceptionText, exceptionIndex) => (
                      <CoverageItemWrapper key={exceptionText}>
                        <OnBlurChangeInput
                          originalValue={exceptionText}
                          onUpdate={(newExceptionText) => {
                            updateField('exceptions')(
                              peril.exceptions.map((original, i_) => {
                                if (i_ === exceptionIndex) {
                                  return newExceptionText
                                }
                                return original
                              }),
                            )
                          }}
                        />
                        <Button
                          variation="danger"
                          onClick={() => {
                            updateField('exceptions')(
                              peril.exceptions.filter(
                                (_, i) => i !== exceptionIndex,
                              ),
                            )
                          }}
                          type="button"
                        >
                          &times;
                        </Button>
                      </CoverageItemWrapper>
                    ))}
                    <Button
                      variation="success"
                      type="button"
                      onClick={() => {
                        updateField('exceptions')(peril.exceptions.concat(['']))
                      }}
                    >
                      + Add exception
                    </Button>
                  </Coverage>
                </CoverageWrapper>

                <span>Add Icon</span>
                <Dropdown
                  placeholder={peril.icon != null ? peril.icon : 'Icon name'}
                  fluid
                  selection
                  options={perilIconOptions}
                  onChange={(event) =>
                    updateField('icon')(event.currentTarget.textContent)
                  }
                />

                <div>Info</div>
                <TextArea
                  value={peril.info}
                  onChange={(_, data) => {
                    updateField('info')(data.value)
                  }}
                />

                <Button
                  variation="danger"
                  type="button"
                  onClick={() => {
                    if (
                      confirm(
                        `Do you really want to delete the peril ${actualTitle}?`,
                      )
                    ) {
                      setParsedPerils(
                        parsedPerils.filter((_, i) => i !== index),
                      )
                    }
                  }}
                >
                  &times; Delete peril
                </Button>
              </PerilEditWrapper>
            )
          })}

        <Button
          type="button"
          variation="success"
          onClick={() => {
            setParsedPerils(
              parsedPerils?.concat([
                {
                  title: '',
                  description: '',
                  info: '',
                  exceptions: [],
                  covered: [],
                  icon: '',
                },
              ]) ?? [],
            )
          }}
        >
          + Add peril
        </Button>
      </Wrapper>
    </>
  )
}

export const PerilsEditor = withShowNotification(PerilsEditorComponent)

const isValidJson = (thing: string): boolean => {
  try {
    JSON.parse(thing)
    return true
  } catch {
    return false
  }
}
