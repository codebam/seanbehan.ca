import { describe, expect, it } from 'vitest';
import { personFacts } from './facts';

describe('personFacts', () => {
	it('never varies with the build variant and names canonical URLs', () => {
		const facts = personFacts();
		expect(facts.name).toBe('Sean Behan');
		expect(facts.handle).toBe('codebam');
		expect(facts.links.website).toBe('https://seanbehan.ca');
		expect(facts.links.portfolio).toBe('https://codebam.ca');
		expect(facts.resume.markdown).toBe('https://seanbehan.ca/resume.md');
		expect(facts.mcp).toBe('https://seanbehan.ca/mcp');
	});

	it('carries the skills and work history an agent should quote', () => {
		const facts = personFacts();
		expect(facts.skills).toContain('Rust');
		expect(facts.experience.length).toBeGreaterThan(0);
	});
});
