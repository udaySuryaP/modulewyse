-- ModuleWyse starter subject/module/topic seed data.
-- This script is idempotent and safe to rerun after the content foundation
-- schema has been applied.

insert into public.subjects (
  slug,
  name,
  short_name,
  code,
  semester,
  status,
  description
)
values
  (
    'oop',
    'Object Oriented Programming',
    'OOP',
    'PBCST304',
    4,
    'available',
    'Covers classes, objects, inheritance, polymorphism, exception handling, and core OOP principles.'
  ),
  (
    'dbms',
    'Database Management Systems',
    'DBMS',
    'TBD',
    null,
    'beta',
    'Covers relational databases, SQL, normalization, transactions, and database design.'
  ),
  (
    'os',
    'Operating Systems',
    'OS',
    'TBD',
    null,
    'coming-soon',
    'Covers process management, memory management, scheduling, synchronization, and file systems.'
  ),
  (
    'cn',
    'Computer Networks',
    'CN',
    'TBD',
    null,
    'coming-soon',
    'Covers network models, protocols, routing, TCP/UDP, IP addressing, and network security basics.'
  ),
  (
    'ds',
    'Data Structures',
    'DS',
    'TBD',
    null,
    'coming-soon',
    'Covers arrays, linked lists, stacks, queues, trees, graphs, searching, and sorting.'
  )
on conflict (slug) do update
set
  name = excluded.name,
  short_name = excluded.short_name,
  code = excluded.code,
  semester = excluded.semester,
  status = excluded.status,
  description = excluded.description;

with module_seed as (
  select
    subjects.id as subject_id,
    subjects.status,
    modules.module_number,
    modules.title
  from (
    values
      ('oop', 1, 'Module 1'),
      ('oop', 2, 'Module 2'),
      ('oop', 3, 'Module 3'),
      ('oop', 4, 'Module 4'),
      ('dbms', 1, 'Module 1'),
      ('dbms', 2, 'Module 2'),
      ('dbms', 3, 'Module 3'),
      ('dbms', 4, 'Module 4'),
      ('dbms', 5, 'Module 5'),
      ('os', 1, 'Module 1'),
      ('os', 2, 'Module 2'),
      ('os', 3, 'Module 3'),
      ('os', 4, 'Module 4'),
      ('os', 5, 'Module 5'),
      ('cn', 1, 'Module 1'),
      ('cn', 2, 'Module 2'),
      ('cn', 3, 'Module 3'),
      ('cn', 4, 'Module 4'),
      ('cn', 5, 'Module 5'),
      ('ds', 1, 'Module 1'),
      ('ds', 2, 'Module 2'),
      ('ds', 3, 'Module 3'),
      ('ds', 4, 'Module 4'),
      ('ds', 5, 'Module 5')
  ) as modules(subject_slug, module_number, title)
  join public.subjects
    on subjects.slug = modules.subject_slug
)
insert into public.modules (
  subject_id,
  module_number,
  title,
  status
)
select
  subject_id,
  module_number,
  title,
  status
from module_seed
on conflict (subject_id, module_number) do update
set
  title = excluded.title,
  status = excluded.status;

with topic_seed as (
  select *
  from (
    values
      ('oop', 1, 'Classes and objects', array['classes', 'objects'], 100, 'available'),
      ('oop', 1, 'Constructors', array['constructor'], 90, 'available'),
      ('oop', 3, 'Inheritance', array['derived class', 'base class'], 100, 'available'),
      ('oop', 3, 'Polymorphism', array['overloading', 'overriding'], 95, 'available'),
      ('oop', 4, 'Exception handling', array['exceptions'], 90, 'available'),
      ('oop', 2, 'Interfaces', array['interface'], 80, 'available'),
      ('oop', 2, 'Packages', array['package'], 75, 'available'),
      ('dbms', 1, 'ER model', array['entity relationship model'], 100, 'beta'),
      ('dbms', 1, 'Relational model', array['relations'], 95, 'beta'),
      ('dbms', 2, 'SQL', array['structured query language'], 100, 'beta'),
      ('dbms', 3, 'Normalization', array['normal forms'], 95, 'beta'),
      ('dbms', 4, 'Transactions', array['acid'], 90, 'beta')
  ) as seed(
    subject_slug,
    module_number,
    title,
    aliases,
    priority,
    status
  )
)
insert into public.topics (
  subject_id,
  module_id,
  title,
  aliases,
  priority,
  status
)
select
  subjects.id,
  modules.id,
  topic_seed.title,
  topic_seed.aliases,
  topic_seed.priority,
  topic_seed.status
from topic_seed
join public.subjects
  on subjects.slug = topic_seed.subject_slug
join public.modules
  on modules.subject_id = subjects.id
  and modules.module_number = topic_seed.module_number
on conflict (module_id, title) do update
set
  aliases = excluded.aliases,
  priority = excluded.priority,
  status = excluded.status;
