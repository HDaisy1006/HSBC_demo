import { describe, it, expect } from 'vitest';
import {
	HIGHLIGHTED_COUNTRIES,
	getCountryColor,
	isHighlighted,
	getCountryLabel,
	extractCountryNames
} from '../src/lib/utils/mapUtils';

describe('mapUtils', () => {
	describe('HIGHLIGHTED_COUNTRIES', () => {
		it('should contain exactly 5 countries', () => {
			expect(HIGHLIGHTED_COUNTRIES).toHaveLength(5);
		});

		it('each country should have name, color, and label', () => {
			for (const c of HIGHLIGHTED_COUNTRIES) {
				expect(c).toHaveProperty('name');
				expect(c).toHaveProperty('color');
				expect(c).toHaveProperty('label');
				expect(c.color).toMatch(/^#[0-9a-fA-F]{6}$/);
				expect(c.label.length).toBeGreaterThan(0);
			}
		});

		it('should include China, United States of America, Russia, India, Brazil', () => {
			const names = HIGHLIGHTED_COUNTRIES.map((c) => c.name);
			expect(names).toContain('China');
			expect(names).toContain('United States of America');
			expect(names).toContain('Russia');
			expect(names).toContain('India');
			expect(names).toContain('Brazil');
		});

		it('should have distinct colors with good contrast', () => {
			const colors = HIGHLIGHTED_COUNTRIES.map((c) => c.color);
			const unique = new Set(colors);
			expect(unique.size).toBe(5);
		});
	});

	describe('getCountryColor', () => {
		it('should return the correct color for highlighted countries', () => {
			expect(getCountryColor('China')).toBe('#E53935');
			expect(getCountryColor('United States of America')).toBe('#1E88E5');
			expect(getCountryColor('Russia')).toBe('#8E24AA');
			expect(getCountryColor('India')).toBe('#FB8C00');
			expect(getCountryColor('Brazil')).toBe('#43A047');
		});

		it('should return default gray for non-highlighted countries', () => {
			expect(getCountryColor('Canada')).toBe('#e8e8e8');
			expect(getCountryColor('Japan')).toBe('#e8e8e8');
			expect(getCountryColor('')).toBe('#e8e8e8');
		});
	});

	describe('isHighlighted', () => {
		it('should return true for highlighted countries', () => {
			expect(isHighlighted('China')).toBe(true);
			expect(isHighlighted('India')).toBe(true);
			expect(isHighlighted('Brazil')).toBe(true);
		});

		it('should return false for non-highlighted countries', () => {
			expect(isHighlighted('Canada')).toBe(false);
			expect(isHighlighted('Japan')).toBe(false);
			expect(isHighlighted('France')).toBe(false);
			expect(isHighlighted('')).toBe(false);
		});
	});

	describe('getCountryLabel', () => {
		it('should return Chinese label for highlighted countries', () => {
			expect(getCountryLabel('China')).toBe('中国');
			expect(getCountryLabel('United States of America')).toBe('美国');
			expect(getCountryLabel('India')).toBe('印度');
		});

		it('should return Chinese name for mapped non-highlighted countries', () => {
			expect(getCountryLabel('Germany')).toBe('德国');
			expect(getCountryLabel('Japan')).toBe('日本');
			expect(getCountryLabel('France')).toBe('法国');
		});

		it('should return original name for unmapped countries', () => {
			expect(getCountryLabel('Atlantis')).toBe('Atlantis');
		});
	});

	describe('extractCountryNames', () => {
		it('should extract country names from GeoJSON features', () => {
			const geoJson = {
				features: [
					{ properties: { name: 'China' } },
					{ properties: { name: 'India' } },
					{ properties: { name: 'Brazil' } }
				]
			};
			const names = extractCountryNames(geoJson as never);
			expect(names).toEqual(['China', 'India', 'Brazil']);
		});

		it('should return empty array for GeoJSON without features', () => {
			const geoJson = {};
			const names = extractCountryNames(geoJson as never);
			expect(names).toEqual([]);
		});
	});
});
