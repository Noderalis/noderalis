% Adds a description field.
gen_enforced_field(WorkspaceCwd, 'description', 'Description Required') :- 
  WorkspaceCwd \= '.',
  % Skip those that already define a "description" field.
  \+ workspace_field(WorkspaceCwd, 'description', _).

% Sets the engine range to that of 14.
gen_enforced_field(WorkspaceCwd, 'engines.node', '>=14') :- 
  WorkspaceCwd \= '.',

% Names the primary author.
gen_enforced_field(WorkspaceCwd, 'author.name', 'Grim').
gen_enforced_field(WorkspaceCwd, 'author.email', 'silencegrim@gmail.com').
gen_enforced_field(WorkspaceCwd, 'author.url', 'https://github.com/TheGrimSilence').

% Sets our builder scripts.
gen_enforced_field(WorkspaceCwd, 'scripts.build', 'run build:compile \"$(pwd)\"') :- 
  WorkspaceCwd \= '.'.
gen_enforced_field(WorkspaceCwd, 'scripts.prepack', 'run build:compile \"$(pwd)\"') :- 
  WorkspaceCwd \= '.'.
gen_enforced_field(WorkspaceCwd, 'scripts.postpack', 'rm -rf lib') :- 
  WorkspaceCwd \= '.'.

% Sets our development entry file.
gen_enforced_field(WorkspaceCwd, 'main','./sources/index.ts') :- 
  WorkspaceCwd \= '.'.

% Sets our publish entry file and typings.
gen_enforced_field(WorkspaceCwd, 'publishConfig.main','./lib/index.js') :- 
  WorkspaceCwd \= '.'.
gen_enforced_field(WorkspaceCwd, 'publishConfig.typings','./lib/index.d.ts') :- 
  WorkspaceCwd \= '.'.

% Sets our included files .
gen_enforced_field(WorkspaceCwd, 'files','./lib/**/*') :- 
  WorkspaceCwd \= '.'.
