"""Create reviewable source/deploy archives using explicit allowlists; no credentials."""
from pathlib import Path
import hashlib,json,re,zipfile
ROOT=Path(__file__).resolve().parents[1]
ART=ROOT/'artifacts'
DATE='2026-10-15'
ROOT_FILES=['README.md','START_HERE.md','AGENT.md','AGENTS.md','plan.md','.env.example','.gitignore','package.json','package-lock.json','template.yaml','template-foundation.yaml','template-external-roles.yaml']
SKIP={'node_modules','.next','out','dist','.local','.aws','.git','__pycache__'}
def source_files():
 for name in ROOT_FILES:yield ROOT/name
 for folder in ['backend','web','scripts','docs','fixtures','research']:
  for p in sorted((ROOT/folder).rglob('*')):
   if not p.is_file() or any(x in SKIP for x in p.relative_to(ROOT/folder).parts):continue
   if p.name.endswith(('.tsbuildinfo','.pyc')) or (p.name.startswith('.env') and p.name!='.env.example'):continue
   yield p

def checked(p):
 b=p.read_bytes()
 if p.suffix.lower() in ['.ts','.tsx','.mjs','.py','.sh','.json','.md','.yaml','.txt']:
  if re.search(rb'\b(?:AKIA|ASIA)[A-Z0-9]{16}\b|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',b):raise ValueError('Possible secret in '+str(p))
 return b

ART.mkdir(exist_ok=True)
source=ART/f'MarginSight-source-{DATE}.zip'
deploy=ART/f'MarginSight-deploy-{DATE}.zip'
with zipfile.ZipFile(source,'w',zipfile.ZIP_DEFLATED) as z:
 for p in source_files():z.writestr(p.relative_to(ROOT).as_posix(),checked(p))
with zipfile.ZipFile(deploy,'w',zipfile.ZIP_DEFLATED) as z:
 for folder in ['backend/dist','web/out','scripts','docs']:
  for p in sorted((ROOT/folder).rglob('*')):
   if p.is_file() and '__pycache__' not in p.parts and p.suffix not in ['.pyc','.map']:z.writestr(p.relative_to(ROOT).as_posix(),checked(p))
 for name in ['template.yaml','template-foundation.yaml','template-external-roles.yaml']:z.writestr(name,checked(ROOT/name))

report={'releaseDate':DATE,'status':'PARTIAL_WITH_EXTERNAL_BLOCKERS','account':'109991964227','region':'ap-southeast-1','aiRegion':'us-east-1','formulaVersion':'margin-v1.1.0','backendTests':39,'webUrl':'https://d2y04qc334m0rd.cloudfront.net','archives':{},'bundleSha256':{}}
for p in [source,deploy]:
 with zipfile.ZipFile(p) as z:
  assert z.testzip() is None
  assert not any(any(part in SKIP-{'dist','out'} for part in Path(n).parts) for n in z.namelist())
  report['archives'][p.name]={'bytes':p.stat().st_size,'files':len(z.namelist()),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
for p in sorted((ROOT/'backend/dist').glob('*.mjs')):report['bundleSha256'][p.name]=hashlib.sha256(p.read_bytes()).hexdigest()
(ART/f'MarginSight-release-{DATE}.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
