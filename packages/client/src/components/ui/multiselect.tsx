'use client'

import { Command as CommandPrimitive, useCommandState } from 'cmdk'
import * as React from 'react'
import { forwardRef, useEffect } from 'react'

import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { cn } from '@/lib/utils'

export interface MultipleSelectorRef {
  focus: () => void
  input: HTMLInputElement
  reset: () => void
  selectedValue: Option[]
}
export interface Option {
  /** Group the options by providing key. */
  [key: string]: boolean | string | undefined
  disable?: boolean
  /** fixed option that can't be removed. */
  fixed?: boolean
  label: string
  value: string
}

interface GroupOption {
  [key: string]: Option[]
}

interface MultipleSelectorProps {
  badgeClassName?: string
  className?: string
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>
  /** Allow user to create option when there is no option matched. */
  creatable?: boolean
  defaultOptions?: Option[]
  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number
  disabled?: boolean
  /** Empty component. */
  emptyIndicator?: React.ReactNode
  /** Group the options base on provided key. */
  groupBy?: string
  /** hide the clear all button. */
  hideClearAllButton?: boolean
  /** Hide the placeholder when there are options selected. */
  hidePlaceholderWhenSelected?: boolean
  /** Props of `CommandInput` */
  inputProps?: Omit<React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>, 'disabled' | 'placeholder' | 'value'>
  /** Loading component. */
  loadingIndicator?: React.ReactNode
  /** Limit the maximum number of selected options. */
  maxSelected?: number
  onChange?: (options: Option[]) => void
  /** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
  onMaxSelected?: (maxLimit: number) => void
  /** async search */
  onSearch?: (value: string) => Promise<Option[]>
  /**
   * sync search. This search will not showing loadingIndicator.
   * The rest props are the same as async search.
   * i.e.: creatable, groupBy, delay.
   **/
  onSearchSync?: (value: string) => Option[]
  /** manually controlled options */
  options?: Option[]
  placeholder?: string
  /**
   * First item selected is a default behavior by cmdk. That is why the default is true.
   * This is a workaround solution by add a dummy item.
   *
   * @reference: https://github.com/pacocoursey/cmdk/issues/171
   */
  selectFirstItem?: boolean
  /**
   * Only work with `onSearch` prop. Trigger search when `onFocus`.
   * For example, when user click on the input, it will trigger the search to get initial options.
   **/
  triggerSearchOnFocus?: boolean
  value?: Option[]
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

function isOptionsExist(groupOption: GroupOption, targetOption: Option[]) {
  for (const [, value] of Object.entries(groupOption)) {
    if (value.some((option) => targetOption.find((p) => p.value === option.value))) {
      return true
    }
  }
  return false
}

function removePickedOption(groupOption: GroupOption, picked: Option[]) {
  const cloneOption = JSON.parse(JSON.stringify(groupOption)) as GroupOption

  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = value.filter((val) => !picked.some((p) => p.value === val.value))
  }
  return cloneOption
}

function transToGroupOption(options: Option[], groupBy?: string) {
  if (options.length === 0) {
    return {}
  }
  if (!groupBy) {
    return {
      '': options,
    }
  }

  const groupOption: GroupOption = {}
  options.forEach((option) => {
    const key = (option[groupBy] as string) || ''
    if (!groupOption[key]) {
      groupOption[key] = []
    }
    groupOption[key].push(option)
  })
  return groupOption
}

/**
 * The `CommandEmpty` of shadcn/ui will cause the cmdk empty not rendering correctly.
 * So we create one and copy the `Empty` implementation from `cmdk`.
 *
 * @reference: https://github.com/hsuanyi-chou/shadcn-ui-expansions/issues/34#issuecomment-1949561607
 **/
const CommandEmpty = forwardRef<HTMLDivElement, React.ComponentProps<typeof CommandPrimitive.Empty>>(
  ({ className, ...props }, forwardedRef) => {
    const render = useCommandState((state) => state.filtered.count === 0)

    if (!render) return null

    return (
      <div
        className={cn('px-2 py-4 text-center text-sm', className)}
        cmdk-empty=""
        ref={forwardedRef}
        role="presentation"
        {...props}
      />
    )
  },
)

CommandEmpty.displayName = 'CommandEmpty'

const MultipleSelector = React.forwardRef<MultipleSelectorRef, MultipleSelectorProps>(
  (
    {
      badgeClassName,
      className,
      commandProps,
      creatable = false,
      defaultOptions: arrayDefaultOptions = [],
      delay,
      disabled,
      emptyIndicator,
      groupBy,
      hideClearAllButton = false,
      hidePlaceholderWhenSelected,
      inputProps,
      loadingIndicator,
      maxSelected = Number.MAX_SAFE_INTEGER,
      onChange,
      onMaxSelected,
      onSearch,
      onSearchSync,
      options: arrayOptions,
      placeholder,
      selectFirstItem = true,
      triggerSearchOnFocus = false,
      value,
    }: MultipleSelectorProps,
    ref: React.Ref<MultipleSelectorRef>,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false)
    const [onScrollbar, setOnScrollbar] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null) // Added this

    const [selected, setSelected] = React.useState<Option[]>(value || [])
    const [options, setOptions] = React.useState<GroupOption>(transToGroupOption(arrayDefaultOptions, groupBy))
    const [inputValue, setInputValue] = React.useState('')
    const debouncedSearchTerm = useDebounce(inputValue, delay || 500)

    React.useImperativeHandle(
      ref,
      () => ({
        focus: () => inputRef?.current?.focus(),
        input: inputRef.current as HTMLInputElement,
        reset: () => setSelected([]),
        selectedValue: [...selected],
      }),
      [selected],
    )

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
        inputRef.current.blur()
      }
    }

    const handleUnselect = React.useCallback(
      (option: Option) => {
        const newOptions = selected.filter((s) => s.value !== option.value)
        setSelected(newOptions)
        onChange?.(newOptions)
      },
      [onChange, selected],
    )

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current
        if (input) {
          if ((e.key === 'Delete' || e.key === 'Backspace') && input.value === '' && selected.length > 0) {
            const lastSelectOption = selected.at(-1)
            // If last item is fixed, we should not remove it.
            if (!lastSelectOption?.fixed) {
              handleUnselect(selected.at(-1)!)
            }
          }
          // This is not a default behavior of the <input /> field
          if (e.key === 'Escape') {
            input.blur()
          }
        }
      },
      [handleUnselect, selected],
    )

    useEffect(() => {
      if (open) {
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchend', handleClickOutside)
      } else {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('touchend', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('touchend', handleClickOutside)
      }
    }, [open])

    useEffect(() => {
      if (value) {
        setSelected(value)
      }
    }, [value])

    useEffect(() => {
      /** If `onSearch` is provided, do not trigger options updated. */
      if (!arrayOptions || onSearch) {
        return
      }
      const newOption = transToGroupOption(arrayOptions || [], groupBy)
      if (JSON.stringify(newOption) !== JSON.stringify(options)) {
        setOptions(newOption)
      }
    }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options])

    useEffect(() => {
      /** sync search */

      const doSearchSync = () => {
        const res = onSearchSync?.(debouncedSearchTerm)
        setOptions(transToGroupOption(res || [], groupBy))
      }

      const exec = async () => {
        if (!onSearchSync || !open) return

        if (triggerSearchOnFocus) {
          doSearchSync()
        }

        if (debouncedSearchTerm) {
          doSearchSync()
        }
      }

      exec()
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus])

    useEffect(() => {
      /** async search */

      const doSearch = async () => {
        setIsLoading(true)
        const res = await onSearch?.(debouncedSearchTerm)
        setOptions(transToGroupOption(res || [], groupBy))
        setIsLoading(false)
      }

      const exec = async () => {
        if (!onSearch || !open) return

        if (triggerSearchOnFocus) {
          await doSearch()
        }

        if (debouncedSearchTerm) {
          await doSearch()
        }
      }

      exec()
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus])

    const CreatableItem = () => {
      if (!creatable) return undefined
      if (
        isOptionsExist(options, [{ label: inputValue, value: inputValue }]) ||
        selected.some((s) => s.value === inputValue)
      ) {
        return undefined
      }

      const Item = (
        <CommandItem
          className="cursor-pointer"
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onSelect={(value: string) => {
            if (selected.length >= maxSelected) {
              onMaxSelected?.(selected.length)
              return
            }
            setInputValue('')
            const newOptions = [...selected, { label: value, value }]
            setSelected(newOptions)
            onChange?.(newOptions)
          }}
          value={inputValue}
        >
          {`Create "${inputValue}"`}
        </CommandItem>
      )

      // For normal creatable
      if (!onSearch && inputValue.length > 0) {
        return Item
      }

      // For async search creatable. avoid showing creatable item before loading at first.
      if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
        return Item
      }

      return undefined
    }

    const EmptyItem = React.useCallback(() => {
      if (!emptyIndicator) return undefined

      // For async search that showing emptyIndicator
      if (onSearch && !creatable && Object.keys(options).length === 0) {
        return (
          <CommandItem
            disabled
            value="-"
          >
            {emptyIndicator}
          </CommandItem>
        )
      }

      return <CommandEmpty>{emptyIndicator}</CommandEmpty>
    }, [creatable, emptyIndicator, onSearch, options])

    const selectables = React.useMemo<GroupOption>(() => removePickedOption(options, selected), [options, selected])

    /** Avoid Creatable Selector freezing or lagging when paste a long string. */
    const commandFilter = React.useCallback(() => {
      if (commandProps?.filter) {
        return commandProps.filter
      }

      if (creatable) {
        return (value: string, search: string) => {
          return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1
        }
      }
      // Using default filter in `cmdk`. We don't have to provide it.
      return undefined
    }, [creatable, commandProps?.filter])

    return (
      <Command
        ref={dropdownRef}
        {...commandProps}
        className={cn('h-auto overflow-visible bg-transparent', commandProps?.className)}
        filter={commandFilter()}
        onKeyDown={(e) => {
          handleKeyDown(e)
          commandProps?.onKeyDown?.(e)
        }}
        shouldFilter={commandProps?.shouldFilter !== undefined ? commandProps.shouldFilter : !onSearch} // When onSearch is provided, we don't want to filter the options. You can still override it.
      >
        <div
          className={cn(
            'border-input ring-offset-background focus-within:border-ring focus-within:ring-ring/30 has-disabled:cursor-not-allowed has-disabled:opacity-50 relative min-h-[38px] rounded-lg border text-sm transition-shadow focus-within:ring-2 focus-within:ring-offset-2',
            {
              'cursor-text': !disabled && selected.length > 0,
              'p-1': selected.length > 0,
            },
            !hideClearAllButton && 'pe-9',
            className,
          )}
          onClick={() => {
            if (disabled) return
            inputRef?.current?.focus()
          }}
        >
          <div className="flex flex-wrap gap-1">
            {selected.map((option) => {
              return (
                <div
                  className={cn(
                    'animate-fadeIn bg-background text-secondary-foreground hover:bg-background data-fixed:pe-2 relative inline-flex h-7 cursor-default items-center rounded-md border border-solid pe-7 pl-2 ps-2 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50',
                    badgeClassName,
                  )}
                  data-disabled={disabled || undefined}
                  data-fixed={option.fixed}
                  key={option.value}
                >
                  {option.label}
                  <button
                    aria-label="Remove"
                    className="text-muted-foreground/80 ring-offset-background hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/30 absolute -inset-y-px -end-px flex size-7 items-center justify-center rounded-e-lg border border-transparent p-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    onClick={() => handleUnselect(option)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUnselect(option)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  >
                    <i
                      aria-hidden="true"
                      className="i-ri-close-line size-4"
                    />
                  </button>
                </div>
              )
            })}
            {/* Avoid having the "Search" Icon */}
            <CommandPrimitive.Input
              {...inputProps}
              className={cn(
                'placeholder:text-muted-foreground flex-1 bg-transparent outline-none disabled:cursor-not-allowed',
                {
                  'ml-1': selected.length > 0,
                  'px-3 py-2': selected.length === 0,
                  'w-full': hidePlaceholderWhenSelected,
                },
                inputProps?.className,
              )}
              disabled={disabled}
              onBlur={(event) => {
                if (!onScrollbar) {
                  setOpen(false)
                }
                inputProps?.onBlur?.(event)
              }}
              onFocus={(event) => {
                setOpen(true)
                triggerSearchOnFocus && onSearch?.(debouncedSearchTerm)
                inputProps?.onFocus?.(event)
              }}
              onValueChange={(value) => {
                setInputValue(value)
                inputProps?.onValueChange?.(value)
              }}
              placeholder={hidePlaceholderWhenSelected && selected.length > 0 ? '' : placeholder}
              ref={inputRef}
              value={inputValue}
            />
            <button
              aria-label="Clear all"
              className={cn(
                'text-muted-foreground/80 hover:text-foreground focus-visible:text-foreground focus-visible:ring-ring/30 absolute end-0 top-0 flex size-9 items-center justify-center rounded-lg border border-transparent transition-shadow focus-visible:outline-none focus-visible:ring-2',
                (hideClearAllButton ||
                  disabled ||
                  selected.length === 0 ||
                  selected.filter((s) => s.fixed).length === selected.length) &&
                  'hidden',
              )}
              onClick={() => {
                setSelected(selected.filter((s) => s.fixed))
                onChange?.(selected.filter((s) => s.fixed))
              }}
              type="button"
            >
              <i
                aria-hidden="true"
                className="i-ri-close-line size-4"
              />
            </button>
          </div>
        </div>
        <div className="relative">
          <div
            className={cn(
              'border-input absolute top-2 z-10 w-full overflow-hidden rounded-lg border',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              !open && 'hidden',
            )}
            data-state={open ? 'open' : 'closed'}
          >
            {open ? (
              <CommandList
                className="bg-popover text-popover-foreground shadow-lg shadow-black/5 outline-none"
                onMouseEnter={() => {
                  setOnScrollbar(true)
                }}
                onMouseLeave={() => {
                  setOnScrollbar(false)
                }}
                onMouseUp={() => {
                  inputRef?.current?.focus()
                }}
              >
                {isLoading ? (
                  <>{loadingIndicator}</>
                ) : (
                  <>
                    {EmptyItem()}
                    {CreatableItem()}
                    {!selectFirstItem && (
                      <CommandItem
                        className="hidden"
                        value="-"
                      />
                    )}
                    {Object.entries(selectables).map(([key, dropdowns]) => (
                      <CommandGroup
                        className="h-full overflow-auto"
                        heading={key}
                        key={key}
                      >
                        <>
                          {dropdowns.map((option) => {
                            return (
                              <CommandItem
                                className={cn('cursor-pointer', option.disable && 'cursor-not-allowed opacity-50')}
                                disabled={option.disable}
                                key={option.value}
                                onMouseDown={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                }}
                                onSelect={() => {
                                  if (selected.length >= maxSelected) {
                                    onMaxSelected?.(selected.length)
                                    return
                                  }
                                  setInputValue('')
                                  const newOptions = [...selected, option]
                                  setSelected(newOptions)
                                  onChange?.(newOptions)
                                }}
                                value={option.value}
                              >
                                {option.label}
                              </CommandItem>
                            )
                          })}
                        </>
                      </CommandGroup>
                    ))}
                  </>
                )}
              </CommandList>
            ) : null}
          </div>
        </div>
      </Command>
    )
  },
)

MultipleSelector.displayName = 'MultipleSelector'
export default MultipleSelector
