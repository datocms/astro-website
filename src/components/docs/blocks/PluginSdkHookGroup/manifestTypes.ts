/**
 * Type representing a manifest.
 */
export type Manifest = {
  /** Hooks and their respective information. */
  hooks: Record<string, HookInfo>;
  /** Base properties and methods available on every context argument. */
  baseCtx: {
    /** Properties in the base context. */
    properties: PropertiesOrMethodsGroup[];
    /** Methods in the base context. */
    methods: PropertiesOrMethodsGroup[];
  };
  /** Extra properties and methods available on every SelfResizingPluginFrameCtx context argument */
  selfResizingPluginFrameCtxSizingUtilities: PropertiesOrMethodsGroup;
};

/**
 * Type representing hook information.
 */
export type HookInfo = {
  /** Name of the hook. */
  name: string;
  /** JSDoc comment and tag for the hook. */
  comment?: Comment;
  /** Non-context arguments for the hook. */
  nonCtxArguments: NonCtxArgument[];
  /** Context argument for the hook, if any. */
  ctxArgument?: CtxArgument;
  /** Return type of the hook function. */
  returnType: string;
  /** Code location where the hook is defined. */
  location: CodeLocation;
};

/**
 * Type representing a code location.
 */
export type CodeLocation = {
  /** File path where the code is defined. */
  filePath: string;
  /** Line number in the file where the hook is defined. */
  lineNumber: number;
};

/**
 * Type alias for parameter or method in context.
 */
export type PropertyOrMethod = {
  /** Description of the parameter or method. */
  comment?: Comment;
  /** Code location where the parameter or method is defined. */
  location: CodeLocation;
  /** Type of the parameter or method. */
  type: string;
};

export type PropertiesOrMethodsGroup = {
  /** Name of the group */
  name?: string;
  /** Description of the group */
  comment?: Comment;
  /** Type of the parameter or method. */
  items: Record<string, PropertyOrMethod>;
};

/**
 * Type alias for the context argument extracted from hook type.
 */
export type CtxArgument = {
  /** Type of the context argument. */
  type: string;
  /** Additional properties in the context argument, if any. */
  additionalProperties?: PropertiesOrMethodsGroup[];
  /** Additional methods in the context argument, if any. */
  additionalMethods?: PropertiesOrMethodsGroup[];
};

/**
 * Type alias for non-context arguments.
 */
export type NonCtxArgument = {
  /** Name of the non-context argument. */
  name: string;
  /** Type name of the non-context argument. */
  typeName: string;
};

/**
 * Type representing a comment.
 */
export type Comment = {
  /** The comment itself. */
  markdownText: string;
  /** JSDoc tag, if any. */
  tag?: string;
  /** Example or example code, if any. */
  example?: string;
  /** Info about deprecation, if any. */
  deprecatedMarkdownText?: string;
};
