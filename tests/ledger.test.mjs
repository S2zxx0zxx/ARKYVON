import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const register=JSON.parse(readFileSync(new URL('../docs/capability-register.json',import.meta.url),'utf8'));
test('exactly 391 unique, properly classified requirements preserved',()=>{
  assert.equal(register.capabilities.length,391);
  assert.equal(new Set(register.capabilities.map(x=>x.id)).size,391);
  for(const c of register.capabilities){
    assert.match(c.id,/^CAP-\d{2}-\d{3}$/);
    assert.ok(['Reuse','Adapt','Compose','Build'].includes(c.strategy));
    assert.match(c.wave,/^[A-H]( onward)?$/);
    assert.ok(c.implementation.length>15);
    assert.ok(c.acceptance.length>10);
    assert.ok(['PROPOSED','PARTIAL_LOCAL','IMPLEMENTED_LOCAL','VERIFIED','RELEASED','BLOCKED'].includes(c.status));
    if(c.status!=='PROPOSED')assert.ok(c.evidence.length>0);
  }
});
test('no release claims without evidence',()=>{
  assert.equal(register.capabilities.some(x=>x.status==='RELEASED'),false);
  assert.equal(register.capabilities.some(x=>x.status==='VERIFIED'),false);
});
